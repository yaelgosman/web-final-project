import React from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';

const CookingReviewLogo = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 220 40" sx={{ width: 220, height: 40, ...props.sx }}>
      <g>
        <path d="M4 20C4 11.1634 11.1634 4 20 4H36C44.8366 4 52 11.1634 52 20C52 28.8366 44.8366 36 36 36H12L4 42V20Z" fill="#004d40"/>
        <path d="M20 25H36V22.5C36 22.5 37.5 15 28 15C18.5 15 20 22.5 20 22.5V25ZM20 25C18.5 25 18.5 28.5 20 28.5H36C37.5 28.5 37.5 25 36 25H20Z" fill="white"/>
        <path d="M46 10L47.7961 13.6393L51.8129 14.223L48.9064 17.0557L49.5922 21.0557L46 19.1667L42.4078 21.0557L43.0936 17.0557L40.1871 14.223L44.2039 13.6393L46 10Z" fill="#FDD835"/>
      </g>
      <text x="65" y="28" fill="#222222" font-family="serif" font-weight="bold" font-size="24" letter-spacing="0.5">
        Let it<tspan fill="#004d40"> Cook</tspan>
      </text>
    </SvgIcon>
  );
};

export default CookingReviewLogo;