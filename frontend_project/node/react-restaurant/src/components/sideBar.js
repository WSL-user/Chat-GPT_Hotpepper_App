import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  HStack,
} from "@chakra-ui/react";

import { Button, Input, useDisclosure } from "@chakra-ui/react";
import RestaurantList from "./restaurant-list";

function RestaurantDrawer(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        レストラン一覧
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack spacing="200px">
              <Text>登録済みレストラン一覧</Text>
              <Button
                onClick={() => {
                  props.newRestaurant();
                  onClose();
                }}
                bg="green"
                color="white"
              >
                New Restaurant
              </Button>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <RestaurantList
              restaurants={props.restaurants}
              restaurantClicked={props.restaurantClicked}
              editClicked={props.editClicked}
              deleteClicked={props.deleteClicked}
              clickeClose={onClose}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button bg="gray" variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default RestaurantDrawer;
