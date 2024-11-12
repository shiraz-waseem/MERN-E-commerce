import React from "react";
import styled from "styled-components";
import { mobile, GZF5, iPad, Tablet } from "./responsive";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../features/cart/cartSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { selectLoggedInUser } from "../features/auth/authSlice";
const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px", marginBottom: "20px" })}
`;

const Wrapper = styled.div`
  padding: 4px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
  background-color: white;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  ${GZF5({ flex: "0", padding: "5px" })}
  ${Tablet({ flex: "none" })}
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${Tablet({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 25px;
  ${iPad({ fontSize: "20px" })}
  ${GZF5({ fontSize: "13px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}

  &:hover {
    border-bottom: 2px solid black;
  }
`;

const OneMenuItem = styled.div`
  font-size: 14px;
  margin: -25px;
  cursor: pointer;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}

  &:hover {
    border-bottom: 2px solid black;
  }
`;

const HomeNav = () => {
  const items = useSelector(selectItems);
  const user = useSelector(selectLoggedInUser);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>CANADA</Language>
          {/* <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 16 }} />
          </SearchContainer> */}
        </Left>
        <Center>
          <Logo>MALIK Traders.</Logo>
        </Center>
        {/* IF NOT LOGGED IN THEN SHOW Otherwise Products */}
        <Right>
          {user ? (
            <OneMenuItem>
              <Link to="/items">BUY NOW</Link>
            </OneMenuItem>
          ) : (
            <>
              {" "}
              <MenuItem>
                <Link to="/signup">REGISTER</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/login">SIGN IN</Link>
              </MenuItem>
            </>
          )}
        </Right>
        <MenuItem>
          <div className="ml-4 flex items-center md:ml-6">
            <Link to="/cartpage">
              <button
                type="button"
                className="rounded-full text-black-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </Link>

            {/* Badge adding */}
            <span className="inline-flex items-center rounded-md mb-9 -ml-3 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              {items.length > 0 ? items.length : "+"}
            </span>
          </div>
        </MenuItem>
      </Wrapper>
    </Container>
  );
};

export default HomeNav;
