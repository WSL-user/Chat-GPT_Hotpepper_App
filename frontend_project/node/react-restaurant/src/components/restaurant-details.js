import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHouse } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Stack,
  StackDivider,
  HStack,
  Divider,
  Spacer,
  CloseButton,
} from "@chakra-ui/react";

const PORT = 8000;

//飲食店の詳細を表示したり, 評価したりする画面
//NOTE データの属性もう少し追加しても良いかな
function RestaurantDetails(props) {
  const [highlighted, setHighlighted] = useState(-1);

  const [token] = useCookies(["mr-token"]);

  let rest = props.restaurant;

  const highlightRate = (high) => (evt) => {
    setHighlighted(high);
  };

  const rateClicked = (rate) => (evt) => {
    fetch(
      `http://127.0.0.1:${PORT}/restaurants/restaurants_api/${rest.id}/rate_restaurants/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["mr-token"]}`,
        },
        body: JSON.stringify({ stars: rate + 1 }),
      }
    )
      .then(() => getDetails())
      .catch((error) => console.log(error));
  };

  const getDetails = () => {
    fetch(`http://127.0.0.1:${PORT}/restaurants/restaurants_api/${rest.id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["mr-token"]}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => props.updateRestaurant(resp))
      .catch((error) => console.log(error));
  };

  const closeCard = () => {
    props.toggleState();
  };

  return (
    <Box>
      {props.restaurant && props.isClose == false ? (
        <Box>
          <Card>
            <CardHeader>
              <HStack>
                <Heading size="md">{props.restaurant.name}</Heading>
                <Box w="20px">
                  <a href={props.restaurant.url}>
                    <FontAwesomeIcon
                      className="homePage"
                      icon={faHouse}
                      fontSize="25px"
                    />
                  </a>
                </Box>
                <Spacer />
                <CloseButton onClick={closeCard} />
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="md" textTransform="uppercase">
                    Address
                  </Heading>
                  <Text pt="1" fontSize="lg">
                    {props.restaurant.address}
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" textTransform="uppercase">
                    rating
                  </Heading>
                  <Text pt="1" fontSize="15px">
                    <div>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={rest.avg_rating > 0 ? "orange" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={rest.avg_rating > 1 ? "orange" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={rest.avg_rating > 2 ? "orange" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={rest.avg_rating > 3 ? "orange" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={rest.avg_rating > 4 ? "orange" : ""}
                      />
                      ({rest.no_of_ratings})
                    </div>
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" textTransform="uppercase">
                    Please rate it!
                  </Heading>
                  <Text pt="1" fontSize="25px">
                    {[...Array(5)].map((e, i) => {
                      return (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={highlighted > i - 1 ? "orange" : ""}
                          onMouseEnter={highlightRate(i)}
                          onMouseLeave={highlightRate(-1)}
                          onClick={rateClicked(i)}
                        />
                      );
                    })}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      ) : null}
    </Box>
  );
}
export default RestaurantDetails;
