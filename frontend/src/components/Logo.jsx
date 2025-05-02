export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 50"
      width="100"
      height="50"
    >
      <path
        d="M10,25 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0 M40,25 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0"
        fill="none"
        stroke="white"
        stroke-width="5"
      >
        <animate
          attributeName="stroke"
          values="white;red;blue;green;yellow;orange;purple;cyan;magenta;lime;pink;white"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
