import { useState } from "react";
import styled from "styled-components";
import { sliderItems } from "./data";
import { BigMobile, iPad, mobile, Tablet } from "./responsive";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  position: relative;
  overflow: hidden;
  /* ${mobile({ display: "none" })} */
  ${BigMobile({ height: "100%" })}
`;

const Arrow = styled.div`
  width: 30px;
  height: 50px;
  background-color: #fff7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 2;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
  ${BigMobile({ flexDirection: "column", height: "90vh" })}
  ${mobile({ flexDirection: "column", height: "100vh" })}
`;

const ImgContainer = styled.div`
  height: 80%;
  flex: 1;
  ${iPad({ height: "50%", flex: "2" })}
  ${BigMobile({ height: "50%", flex: "0", marginTop: "70px" })}
`;

const Image = styled.img`
  height: 80%;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;
  ${BigMobile({ marginTop: "-50px" })}
`;

const Title = styled.h1`
  font-size: 65px;
  font-weight: 600;
  line-height: 1.2;
  ${Tablet({ fontSize: "30px" })}
`;

const Desc = styled.p`
  margin: 20px 0px;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 2px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
  border: 2px solid black;
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2); // 0 1 2. Agar 1 py left py 0. Agar shru 0 py tw 2 last mein left py
    } else {
      setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0); // 0 1 2. Agar 1 py right py 2. Agar shru 0 py tw 1 last(2) mein 0 py
    }
  };

  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowLeftIcon />
      </Arrow>
      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>
            <InfoContainer>
              <Title>{item.title}</Title>
              <Desc>{item.desc}</Desc>
              <Button>
                <Link to="/products">SHOP NOW</Link>
              </Button>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>
      <Arrow direction="right" onClick={() => handleClick("right")}>
        <ArrowRightIcon />
      </Arrow>
    </Container>
  );
};

export default Slider;
