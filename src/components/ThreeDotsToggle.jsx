import { forwardRef } from "react";
import styled from "styled-components";

const ThreeDots = styled.span`
  &::after {
    content:"\\22EF";
    font-size: 30px;
    margin-left: 5px;
    vertical-align: middle;
  }
`

const ThreeDotsToggle = forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      style={{ textDecoration: "none"}}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <ThreeDots/>
    </a>
  ));
  export default ThreeDotsToggle