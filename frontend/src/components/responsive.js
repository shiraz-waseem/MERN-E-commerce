import { css } from "styled-components";

export const mobile = (props) => {
  return css`
    @media only screen and (max-width: 380px) {
      ${props}
    }
  `;
};

// TO DO different mobile screens. down
export const GZF5 = (props) => {
  return css`
    @media only screen and (max-width: 405px) {
      ${props}
    }
  `;
};

// For Slider
export const iPad = (props) => {
  return css`
    @media only screen and (max-width: 1024px) {
      ${props}
    }
  `;
};

export const Tablet = (props) => {
  return css`
    @media only screen and (max-width: 780px) {
      ${props}
    }
  `;
};

export const BigMobile = (props) => {
  return css`
    @media only screen and (max-width: 500px) {
      ${props}
    }
  `;
};

export const FooterTab = (props) => {
  return css`
    @media only screen and (max-width: 820px) {
      ${props}
    }
  `;
};
