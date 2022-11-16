import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { ThemeContext } from "../context/theme.context";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row } from "antd";

// Shopping Cart
import { FaShoppingCart } from "react-icons/fa";
import ShoppingCart from "../components/ShoppingCart";
import { getFavouritesService } from "../services/tasteit.services";

const { Meta } = Card;

function Favourites() {
  // Context
  const { toggleCart } = useContext(ThemeContext);
  const { isLoggedIn, cartProducts } = useContext(AuthContext);

  // To manage list of favourite products
  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // When page is rendered
  useEffect(() => {
    handleMyFavourites();
  }, []);

  const handleMyFavourites = async (type) => {
    try {
      const response = await getFavouritesService();
      setList(response.data.favourites);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Guard clause
  if (isFetching === true) {
    return <h3>loading...</h3>;
  }

  return (
    <div>
      <h2>Mis favoritos</h2>
      <Row style={{ width: "100%", justifyContent: "center" }}>
        {list.map((eachProduct) => {
          return (
            <Col key={eachProduct._id}>
              <Card hoverable>
                <Link to={`/${eachProduct._id}/details`} style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <Meta style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0px auto", padding: "0px" }} />
                  <img
                    alt="example"
                    src={eachProduct.image}
                    style={{ width: "100%", height: "155px", margin: 0 }}
                  />
                  <h2>{eachProduct.name}</h2>
                  <p style={{ margin: 0 }}>
                    <span style={{ fontWeight: "bolder" }}>Precio:</span>{" "}
                    {eachProduct.price}€
                  </p>
                  <p style={{ margin: "0 auto 2px" }}>
                    <span style={{ fontWeight: "bolder" }}>Localidad:</span>{" "}
                    {eachProduct.location}
                  </p>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>
      {isLoggedIn && (
        <button onClick={toggleCart} className="cart-button">
          <FaShoppingCart size="2em" />
          <div className="cart-button-quantity">
            <span>{cartProducts.length}</span>
          </div>
        </button>
      )}
      <ShoppingCart />
    </div>
  );
}

export default Favourites;
