import React from 'react';

export function BloodPressureIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v20M2 12h20" />
      <path d="M8 9a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M16 16a4 4 0 1 0 -8 0" />
    </svg>
  );
}