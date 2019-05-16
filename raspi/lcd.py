import I2C_LCD_driver
import time

mylcd = I2C_LCD_driver.lcd()

spell = "test"

def announceSpell(spell) {
  mylcd.lcd_clear()
  mylcd.lcd_display_string("Spell cast:",1) 
  mylcd.lcd_display_string(spell,2)   # Show spell
}

announceSpell()