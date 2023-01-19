import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#0a1057',
            fontSize: theme.typography.pxToRem(16),
            flexWrap: 'wrap'
        },
        [`& .${tooltipClasses.arrow}`]: {
            "&:before": {
                backgroundColor: `#0a1057`,
            }
            }
    }));
