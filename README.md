# FreeD - Chataigne Module

This module has been developed to receive FreeD protocol into Chataigne.

To learn more about Chataigne and download it, please visit: http://benjamin.kuperberg.fr/chataigne/

## Module

This module is a receive-only UDP one. You can find more on the protocol on the following link: https://www.manualsdir.com/manuals/641433/vinten-radamec-free-d.html
The Type D1 is implemented on this module, for receiving the camera position and orientation data from a Free-D unit.
You will then find:
- camera ID
- camera pan angle
- camera tilt angle
- camera X-position
- camera Y-position
- camera Height (Z-position)
- camera zoom
- camera focus

Note that in the current state, the checksum is not checked.