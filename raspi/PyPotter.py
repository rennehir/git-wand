# HELLO

import sys
import cv2
from cv2 import *
import numpy as np
import math
import os
from os import listdir
from os.path import isfile, join, isdir
import time
import threading
from threading import Thread
from statistics import mean 
from CountsPerSec import CountsPerSec
from GitApi import GitApi

# Check for required number of arguments
if (len(sys.argv) < 3):
    print("Incorrect number of arguments. Required Arguments: [video source url] [API URL]")
    sys.exit(0)

# Parse Required Arguments
videoSource = sys.argv[1]
apiUrl = sys.argv[2]

# Parse Optional Arguments
IsRemoveBackground = False #improves performance
IsShowOutputWindows = True
IsTraining = True

if (len(sys.argv) >= 4):
    IsRemoveBackground = sys.argv[3] == "True"

if (len(sys.argv) >= 5):
    IsShowOutputWindows = sys.argv[4] == "True"

if (len(sys.argv) >= 6):
    IsTraining = sys.argv[5] == "True"

# Initialize REST API Wrapper
magic = GitApi(apiUrl)

# Constants
TrainingResolution = 50
TrainingNumPixels = TrainingResolution * TrainingResolution
TrainingFolderName = "Training"
SpellEndMovement = 1
MinSpellLength = 15
MinSpellDistance = 100

# Booleans to turn on or off output windows
IsShowOriginal = True
IsShowBackgroundRemoved = True
IsShowThreshold = True
IsShowOutput = True

if IsShowOutputWindows:
    IsShowOriginal = True
    IsShowBackgroundRemoved = True
    IsShowThreshold = True
    IsShowOutput = True

# Create Windows
if (IsShowOriginal):
    cv2.namedWindow("Original")
    cv2.moveWindow("Original", 0, 0)

if (IsShowBackgroundRemoved):
    cv2.namedWindow("BackgroundRemoved")
    cv2.moveWindow("BackgroundRemoved", 640, 0)

if (IsShowThreshold):
    cv2.namedWindow("Threshold")
    cv2.moveWindow("Threshold", 0, 480+30)

if (IsShowOutput):
    cv2.namedWindow("Output")
    cv2.moveWindow("Output", 640, 480+30)

# Init Global Variables
IsNewFrame = False
nameLookup = {}
LastSpell = "None"

originalCps = CountsPerSec()
noBackgroundCps = CountsPerSec()
thresholdCps = CountsPerSec()
outputCps = CountsPerSec()

lk_params = dict( winSize  = (25,25),
                  maxLevel = 7,
                  criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03))

IsNewFrame = False
frame = None

IsNewFrameNoBackground = False
frame_no_background = None

IsNewFrameThreshold = False
frameThresh = None

findNewWands = True
trackedPoints = None
wandTracks = []

def InitClassificationAlgo() :
    """
    Create and Train k-Nearest Neighbor Algorithm
    """
    global knn, nameLookup
    labelNames = []
    labelIndexes = []
    trainingSet = []
    numPics = 0
    dirCount = 0
    scriptpath = os.path.realpath(__file__)
    trainingDirectory = join(os.path.dirname(scriptpath), TrainingFolderName)

    # Every folder in the training directory contains a set of images corresponding to a single spell.
    # Loop through all folders to train all spells.
    for d in listdir(trainingDirectory):
        if isdir(join(trainingDirectory, d)):
            nameLookup[dirCount] = d
            dirCount = dirCount + 1
            for f in listdir(join(trainingDirectory,d)):
                if isfile(join(trainingDirectory,d,f)):
                    labelNames.append(d)
                    labelIndexes.append(dirCount-1)
                    trainingSet.append(join(trainingDirectory,d,f));
                    numPics = numPics + 1

    print ("Trained Spells: ")
    print (nameLookup)

    samples = []
    for i in range(0, numPics):
        img = cv2.imread(trainingSet[i])
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        samples.append(gray);
        npArray = np.array(samples)
        shapedArray = npArray.reshape(-1,TrainingNumPixels).astype(np.float32);

    # Create KNN and Train
    knn = cv2.ml.KNearest_create()
    knn.train(shapedArray, cv2.ml.ROW_SAMPLE, np.array(labelIndexes))

def ClassifyImage(img):
    """
    Classify input image based on previously trained k-Nearest Neighbor Algorithm
    """
    global knn, nameLookup, args
    print("img", img)
    print("img.size", img.size)
    if (img.size  <= 0):
        return "Error"

    size = (TrainingResolution, TrainingResolution)
    test_gray = cv2.resize(img,size,interpolation=cv2.INTER_LINEAR)
    
    imgArr = np.array(test_gray).astype(np.float32)
    sample = imgArr.reshape(-1, TrainingNumPixels).astype(np.float32)
    ret, result, neighbours, dist = knn.findNearest(sample,k=5)
    print(ret, result, neighbours, dist)

    if IsTraining:
        filename = "char" + str(time.time()) + nameLookup[ret] + ".png"
        cv2.imwrite(join(TrainingFolderName, filename), test_gray)

    if nameLookup[ret] is not None:
        print("Match: " + nameLookup[ret])
        return nameLookup[ret]
    else:
        return "error"

def PerformSpell(spell):
    """
    Make the desired Home Assistant REST API call based on the spell
    """
    if (spell=="incendio"):
        magic.MakeMagic("incendio")
    elif (spell=="aguamenti"):
        magic.MakeMagic("aguamenti")
    elif (spell=="alohomora"):
        magic.MakeMagic("alohomora")
    elif (spell=="silencio"):
        magic.MakeMagic("silencio")
    elif (spell=="specialis_revelio"):
        magic.MakeMagic("specialis_revelio")
    elif (spell=="revelio"):
        magic.MakeMagic("revelio")
    elif (spell == "tarantallegra"):
        magic.MakeMagic("tarantallegra")

def CheckForPattern(wandTracks, exampleFrame):
    """
    Check the given wandTracks to see if is is complete, and if it matches a trained spell
    """
    global find_new_wands, LastSpell

    if (wandTracks == None or len(wandTracks) == 0):
        return

    thickness = 10
    croppedMax =  TrainingResolution - thickness

    distances = []
    wand_path_frame = np.zeros_like(exampleFrame)
    prevTrack = wandTracks[0]

    for track in wandTracks:
        x1 = prevTrack[0]
        x2 = track[0]
        y1 = prevTrack[1]
        y2 = track[1]

        # Calculate the distance
        distance = math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
        distances.append(distance)

        cv2.line(wand_path_frame, (x1, y1),(x2, y2), (255,255,255), thickness)
        prevTrack = track

    mostRecentDistances = distances[-20:]
    avgMostRecentDistances = mean(mostRecentDistances)
    sumDistances = sum(distances)

    contours, hierarchy = cv2.findContours(wand_path_frame,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    print(avgMostRecentDistances, SpellEndMovement, len(distances), MinSpellLength)
    # Determine if wand stopped moving by looking at recent movement (avgMostRecentDistances), and check the length of distances to make sure the spell is reasonably long
    if (avgMostRecentDistances < SpellEndMovement and len(distances) > MinSpellLength):
        print("spell is reasonable")
        # Make sure wand path is valid and is over the defined minimum distance
        if (len(contours) > 0) and sumDistances > MinSpellDistance:
            cnt = contours[0]
            x,y,w,h = cv2.boundingRect(cnt)
            crop = wand_path_frame[y-10:y+h+10,x-30:x+w+30]
            result = ClassifyImage(crop);
            cv2.putText(wand_path_frame, result, (0,50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255,255,255))

            print("Result: ", result, " Most Recent avg: ", avgMostRecentDistances, " Length Distances: ", len(distances), " Sum Distances: ", sumDistances)
            print("")

            PerformSpell(result)
            LastSpell = result
        find_new_wands = True
        del wandTracks[:]

    if wand_path_frame is not None:
        if (IsShowOutput):
            wandPathFrameWithText = AddIterationsPerSecText(wand_path_frame, outputCps.countsPerSec())
            cv2.putText(wandPathFrameWithText, "Last Spell: " + LastSpell, (10, 400), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255))
            cv2.imshow("Output", wandPathFrameWithText)

    return wandTracks

def RemoveBackground():
    """
    Thread for removing background
    """
    global frame, frame_no_background, IsNewFrame, IsNewFrameNoBackground

    fgbg = cv2.createBackgroundSubtractorMOG2()
    t = threading.currentThread()
    while getattr(t, "do_run", True):
        if (IsNewFrame):
            IsNewFrame = False

            # Subtract Background
            fgmask = fgbg.apply(frame, learningRate=0.001)
            frame_no_background = cv2.bitwise_and(frame, frame, mask = fgmask)
            IsNewFrameNoBackground = True

            if (IsShowBackgroundRemoved):
                    frameNoBackgroundWithCounts = AddIterationsPerSecText(frame_no_background.copy(), noBackgroundCps.countsPerSec())
                    cv2.imshow("BackgroundRemoved", frameNoBackgroundWithCounts)
        else:
            time.sleep(0.001)

def CalculateThreshold():
    """
    Thread for calculating frame threshold
    """
    global frame, frame_no_background, frameThresh, IsNewFrame, IsNewFrameNoBackground, IsNewFrameThreshold

    t = threading.currentThread()
    thresholdValue = 240
    while getattr(t, "do_run", True):
        if (IsRemoveBackground and IsNewFrameNoBackground) or (not IsRemoveBackground and IsNewFrame):
            if IsRemoveBackground:
                IsNewFrameNoBackground = False
                frame_gray = cv2.cvtColor(frame_no_background, cv2.COLOR_BGR2GRAY)
            
            if not IsRemoveBackground:
                IsNewFrame = False
                frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            ret, frameThresh = cv2.threshold(frame_gray, thresholdValue, 255, cv2.THRESH_BINARY);

            IsNewFrameThreshold = True
            if (IsShowThreshold):
                    frameThreshWithCounts = AddIterationsPerSecText(frameThresh.copy(), thresholdCps.countsPerSec())
                    cv2.imshow("Threshold", frameThreshWithCounts)
        else:
            time.sleep(0.001)

def ProcessData():
    """
    Thread for processing final frame
    """
    global frameThresh, IsNewFrameThreshold, findNewWands, wandTracks

    oldFrameThresh = None
    trackedPoints = None
    t = threading.currentThread()

    while getattr(t, "do_run", True):
        if (IsNewFrameThreshold):
            IsNewFrameThreshold = False
            localFrameThresh = frameThresh.copy()

            if (findNewWands):
                # Identify Potential Wand Tips using GoodFeaturesToTrack
                trackedPoints = cv2.goodFeaturesToTrack(localFrameThresh, 5, .01, 30)

                if trackedPoints is not None:
                    findNewWands = False
            else:
                # calculate optical flow
                nextPoints, statusArray, err = cv2.calcOpticalFlowPyrLK(oldFrameThresh, localFrameThresh, trackedPoints, None, **lk_params)

                # Select good points
                good_new = nextPoints[statusArray==1]
                good_old = trackedPoints[statusArray==1]

                if (len(good_new) > 0):
                    # draw the tracks
                    for i,(new,old) in enumerate(zip(good_new,good_old)):
                        a,b = new.ravel()
                        c,d = old.ravel()
           
                        wandTracks.append([a, b])
           
                    # Update which points are tracked
                    trackedPoints = good_new.copy().reshape(-1,1,2)

                    wandTracks = CheckForPattern(wandTracks, localFrameThresh)
           
                else:
                    # No Points were tracked, check for a pattern and start searching for wands again
                    #wandTracks = CheckForPattern(wandTracks, localFrameThresh)
                    wandTracks = []
                    findNewWands = True
            
            # Store Previous Threshold Frame
            oldFrameThresh = localFrameThresh

            
        else:
            time.sleep(0.001)

def AddIterationsPerSecText(frame, iterations_per_sec):
    """
    Add iterations per second text to lower-left corner of a frame.
    FRAMES UPDATE OK
    """
    cv2.putText(frame, "{:.0f} iterations/sec".format(iterations_per_sec),
        (10, 450), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255))
    return frame

# Initialize and traing the spell classification algorithm
InitClassificationAlgo()

# Start thread to remove frame background
if IsRemoveBackground:
    RemoveBackgroundThread = Thread(target=RemoveBackground)
    RemoveBackgroundThread.do_run = True
    RemoveBackgroundThread.daemon = True
    RemoveBackgroundThread.start()

# Start thread to calculate threshold
CalculateThresholdThread = Thread(target=CalculateThreshold)
CalculateThresholdThread.do_run = True
CalculateThresholdThread.daemon = True
CalculateThresholdThread.start()

# Start thread to process final frame
ProcessDataThread = Thread(target=ProcessData)
ProcessDataThread.do_run = True
ProcessDataThread.daemon = True
ProcessDataThread.start()

# Set OpenCV video capture source
videoCapture = cv2.VideoCapture(videoSource)

# Main Loop
while True:
    # Get most recent frame
    ret, localFrame = videoCapture.read()

    if (ret):
        frame = localFrame.copy()
        # If successful, flip the frame and set the Flag for the next process to take over
        cv2.flip(frame, 1, frame) # Flipping the frame is done so the spells look like what we expect, instead of the mirror image
        IsNewFrame = True

        # Update Windows
        if (IsShowOriginal):
            frameWithCounts = AddIterationsPerSecText(frame.copy(), originalCps.countsPerSec())
            cv2.imshow("Original", frameWithCounts)
            #cv2.waitKey(1)
    else:
        # If an error occurred, try initializing the video capture again
        videoCapture = cv2.VideoCapture(videoSource)

    # Check for ESC key, if pressed shut everything down
    if (cv2.waitKey(1) is 27):
         break

# Shutdown PyPotter
if IsRemoveBackground:
    RemoveBackgroundThread.do_run = False
    RemoveBackgroundThread.join()

CalculateThresholdThread.do_run = False
ProcessDataThread.do_run = False

CalculateThresholdThread.join()
ProcessDataThread.join()

cv2.destroyAllWindows()
