/*
 ==============================================================================

  Chataigne Module for FreeD protocol

  Copyright: Nicolas Erard, February 2024

  ==============================================================================
===============================================================================
This file is a Chataigne Custom Module to input FreeD protocol into the software.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
===============================================================================
*/

function init() {

    cameraId = local.values.addIntParameter("Camera id",   "Pan"  , 0, 0, 255);
    pan = local.values.addFloatParameter("Pan",   "Pan"  , 0.0, -180.0, 180.0);
    tilt = local.values.addFloatParameter("Tilt", "Tilt" , 0.0, -180.0, 180.0);
    roll = local.values.addFloatParameter("Roll", "Roll" , 0.0, -180.0, 180.0);

    xPosition = local.values.addFloatParameter("X position", "X Position", 0.0, -131.07, 131.07);
    yPosition = local.values.addFloatParameter("Y position", "Y Position", 0.0, -131.07, 131.07);
    zPosition = local.values.addFloatParameter("Z position", "Z Position", 0.0, -131.07, 131.07);
    zoom = local.values.addIntParameter("Zoom", "Zoom" , 0, 0, 16777215);
    cameraFocus = local.values.addIntParameter("Camera Focus", "Camera Focus" , 0, 0, 16777215);
}
function dataReceived(data)
{

    // receive D0 type FreeD, documentation on https://www.manualsdir.com/manuals/641433/vinten-radamec-free-d.html appendix A and B
    var message_type = data[0];
    var camera_id = data[1];
    var camera_pan_angle_1 = data[2];
    var camera_pan_angle_2 = data[3];
    var camera_pan_angle_3 = data[4];
    var camera_tilt_angle_1 = data[5];
    var camera_tilt_angle_2 = data[6];
    var camera_tilt_angle_3 = data[7];
    var camera_roll_angle_1 = data[8];
    var camera_roll_angle_2 = data[9];
    var camera_roll_angle_3 = data[10];
    var camera_position_x_1 = data[11];
    var camera_position_x_2 = data[12];
    var camera_position_x_3 = data[13];
    var camera_position_y_1 = data[14];
    var camera_position_y_2 = data[15];
    var camera_position_y_3 = data[16];
    var camera_position_z_1 = data[17];
    var camera_position_z_2 = data[18];
    var camera_position_z_3 = data[19];
    var camera_zoom_1 = data[20];
    var camera_zoom_2 = data[21];
    var camera_zoom_3 = data[22];
    var camera_focus_1 = data[23];
    var camera_focus_2 = data[24];
    var camera_focus_3 = data[25];
    var user_defined_1 = data[26];
    var user_defined_2 = data[27];
    var checksum = data[28];

    // camera id
    cameraId.set(camera_id);

    // pan Angle
    // 1st bit as the sign bit
    var firstBit = camera_pan_angle_1 >> 7;
    
    // Integer part with the 8 following bits
    var integer8Bits = ((camera_pan_angle_1 & 0x7F) << 1) | (camera_pan_angle_2 >> 7);

    // Fractional part with the last 15 bits
    var fractional15bits = (((camera_pan_angle_2 >> 1 ) << 8) | camera_pan_angle_3) / 32768;

    // var fractional15bits = (camera_pan_angle_3) / 256;

    var angle = firstBit ? -1  * (((integer8Bits ^ 0xFF) + 1) + fractional15bits) : integer8Bits + fractional15bits;
    pan.set(angle);


    // tilt Angle
    // 1st bit as the sign bit
    var firstBit = camera_tilt_angle_1 >> 7;

    // Integer part with the 8 following bits
    var integer8Bits = ((camera_tilt_angle_1 & 0x7F) << 1) | (camera_tilt_angle_2 >> 7);

    // Fractional part with the last 15 bits
    var fractional15bits = (((camera_tilt_angle_2 >> 1 ) << 8) | camera_tilt_angle_3) / 32768;

    // var fractional15bits = (camera_tilt_angle_3) / 256;

    var angle = firstBit ? -1  * (((integer8Bits ^ 0xFF) + 1) + fractional15bits) : integer8Bits + fractional15bits;
    tilt.set(angle);


    // roll Angle
    // 1st bit as the sign bit
    var firstBit = camera_roll_angle_1 >> 7;

    // Integer part with the 8 following bits
    var integer8Bits = ((camera_roll_angle_1 & 0x7F) << 1) | (camera_roll_angle_2 >> 7);

    // Fractional part with the last 15 bits
    var fractional15bits = (((camera_roll_angle_2 >> 1 ) << 8) | camera_roll_angle_3) / 32768;

    // var fractional15bits = (camera_roll_angle_3) / 256;

    var angle = firstBit ? -1  * (((integer8Bits ^ 0xFF) + 1) + fractional15bits) : integer8Bits + fractional15bits;
    roll.set(angle);

    // pour X

// Extraire le premier bit de la représentation
    var firstBit = camera_position_x_1 >> 7;

// Faire un entier avec les 17 prochains bits
    var entier17Bits = ((camera_position_x_1 & 0x7F) << 10) | (camera_position_x_2 << 2) | (camera_position_x_3 & 0x3F);
    // var entier17Bits = ((camera_position_x_1 & 0x7F) << 10) | (camera_position_x_2 << 2) | (camera_position_x_3 >> 2);

// Un deuxième entier des 6 derniers bits
    var fractional6bits = (camera_position_x_3 & 0x3F) / 64;
    // var fractional6bits = (camera_position_x_3 >> 2) / 64;

    var millimeters = (firstBit ? -1  * (((entier17Bits ^ 0x1FFFF) + 1) + fractional6bits) : entier17Bits + fractional6bits) / 1000;
    xPosition.set(millimeters);

    // pour Y

// Extraire le premier bit de la représentation
    var firstBit = camera_position_y_1 >> 7;

// Faire un entier avec les 17 prochains bits
    var entier17Bits = ((camera_position_y_1 & 0x7F) << 10) | (camera_position_y_2 << 2) | (camera_position_y_3 >> 6);

// Un deuxième entier des 6 derniers bits
    var fractional6bits = (camera_position_y_3 >> 2) / 64;

    var millimeters = (firstBit ? -1  * (((entier17Bits ^ 0x1FFFF) + 1) + fractional6bits) : entier17Bits + fractional6bits) / 1000;

    yPosition.set(millimeters);

    // pour Z

// Extraire le premier bit de la représentation
    var firstBit = camera_position_z_1 >> 7;

// Faire un entier avec les 17 prochains bits
    var entier17Bits = ((camera_position_z_1 & 0x7F) << 10) | (camera_position_z_2 << 2) | (camera_position_z_3 >> 6);

// Un deuxième entier des 6 derniers bits
    var fractional6bits = (camera_position_z_3 >> 2) / 64;


    var millimeters = (firstBit ? -1  * (((entier17Bits ^ 0x1FFFF) + 1) + fractional6bits) : entier17Bits + fractional6bits) / 1000;
    zPosition.set(millimeters);


    // camera zoom
    var zoom_value = camera_zoom_1 << 16 | camera_zoom_2 << 8 | camera_zoom_3;
    zoom.set(zoom_value);


    // camera focus
    var focus_value = camera_focus_1 << 16 | camera_focus_2 << 8 | camera_focus_3;
    cameraFocus.set(focus_value);

}

function moduleParameterChanged(param) {
}

function moduleValueChanged(value) {
}

// This is the callback function for the "Custom command" command
function customCmd(val) {
}