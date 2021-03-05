import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress} from '@material-ui/core';

export default function ProgressBar({ value }) {

    let color = 0x000000; 
    let color_str;
    let most_intense_color;

    // Lower values get you redder colors.
    // Higher values get you green colors.
    let r = 255 - value;
    let g = value;

    // Find if green or red has the highest intensity
    // This is too fix the 'browning' of middle values.
    most_intense_color = (r > g) ? 255 / r : 255 / g;

    // Tone the intensity down slightly for both color values
    r *= (most_intense_color * .9);
    g *= (most_intense_color * .9);

    // Bit shift the color values to the correct hex format.
    color |= r;
    color <<= 8;
    color |= g;
    color <<= 8;

    // Convert it to a css value.
    color_str = (color <= 0xFF00) ? "00" + color.toString(16) : color.toString(16);

    const StyledLinearProgress = withStyles({
        colorPrimary: {
            backgroundColor: "#ccc"
        },
        barColorPrimary: {
            backgroundColor: `#${color_str}`
        }
    })(LinearProgress);

    return (
        <StyledLinearProgress style={{ margin: "auto 0", width: "75%", height: "12px" }} variant="determinate" value={(value / 255) * 100} />
    );
}