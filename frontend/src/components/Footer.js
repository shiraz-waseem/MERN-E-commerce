// import {
//   Facebook,
//   Instagram,
//   MailOutline,
//   Phone,
//   Pinterest,
//   Room,
//   Twitter,
// } from "@material-ui/icons";
import styled from "styled-components";
import { BigMobile, FooterTab, iPad, mobile } from "./responsive";

const Container = styled.div`
  background-color: rgb(17 24 39);
  display: flex;
  ${BigMobile({ flexDirection: "column" })}
  color: white;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
  margin: 20px 0px;
  ${BigMobile({ width: "80%" })}
`;

const SocialContainer = styled.div`
  display: flex;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
  ${FooterTab({ display: "none" })}
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
  /* ${mobile({ backgroundColor: "#fff8f8" })} */
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Payment = styled.img`
  width: 50%;
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>Malik Traders.</Logo>
        <Desc>
          {/* We offer... */}
          Malik Traders: Canada’s Trusted Store for Quality & Convenience –
          Shop, Order, and Relax as We Deliver to Your Doorstep!
        </Desc>
        <SocialContainer>
          <SocialIcon color="3B5999">
            <i class="fa-brands fa-facebook"></i>
          </SocialIcon>
          <SocialIcon color="E4405F">
            <i class="fa-brands fa-instagram"></i>
          </SocialIcon>
          {/* <SocialIcon color="55ACEE">
            <Twitter />
          </SocialIcon>
          <SocialIcon color="E60023">
            <Pinterest />
          </SocialIcon> */}
        </SocialContainer>
      </Left>
      <Center>
        {/* <Title>Useful Links</Title> */}
        <List>
          <ListItem>Hookah</ListItem>
          <ListItem>Plastic Bags</ListItem>
          <ListItem>Bongs</ListItem>
          <ListItem>Rolling Papers</ListItem>
          <ListItem>Mobile Accessories</ListItem>
          <ListItem>Duracell Batteries</ListItem>
          <ListItem>Nibo Gas Lighter Refill</ListItem>
          <ListItem>Panasonic Batteries</ListItem>
          <ListItem>Eagle Torch Lighters</ListItem>
          <ListItem>BIC Lighters</ListItem>
        </List>
      </Center>

      <Right>
        <Title>Contact</Title>
        <ContactItem>
          <i
            class="fa-solid fa-location-dot"
            style={{ marginRight: "10px", fontSize: "1.2rem" }}
          ></i>
          CANADA, ONTARIO
        </ContactItem>
        <ContactItem>
          <i
            class="fa-solid fa-phone"
            style={{ marginRight: "10px", fontSize: "1.2rem" }}
          ></i>
          +1 (365) 999-9597
        </ContactItem>
        <ContactItem>
          <i
            class="fa-solid fa-envelope"
            style={{ marginRight: "10px", fontSize: "1.2rem" }}
          ></i>
          maliktraders123321@gmail.com
        </ContactItem>
        <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </Right>
    </Container>
  );
};

export default Footer;
