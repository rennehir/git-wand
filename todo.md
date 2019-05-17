### PI

verkko

update upgrade

```
sudo apt-get -y install cmake libjpeg8-dev
sudo apt-get -y install git
 
cd ~
git clone https://github.com/jacksonliam/mjpg-streamer.git
 
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install
```

Test:

```
./mjpg_streamer -i "./input_uvc.so -r 640x480 -f 41  -rot 0" -o "./output_http.so"
```