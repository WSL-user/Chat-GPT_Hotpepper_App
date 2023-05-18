import React, { useState, useEffect, useRef } from 'react';
import { API } from '../api-service';
import { useChatGPT } from '../hooks/useChatGPT';
import { useCookies } from 'react-cookie';
import '../App.css';
import Select, { components } from 'react-select';

import {
  Container,
  FormControl,
  Flex,
  Box,
  Center,
  Text,
  Square,
  HStack,
  VStack,
} from '@chakra-ui/react';

import { groupedOptions, colorOptions } from './docs/data';
function RestaurantSearch(props) {
  const LIMIT = 10;
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState('');
  // const [optioned_query, setOptionedQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [chatGPTtext, setChatGPTText] = useState('');
  const [startLoading, setStartLoading] = useState(false);
  const [token] = useCookies(['mr-token']);
  const [id, setId] = useCookies(['restaurant-id']);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  //クエリとオプションを結合
  const concatQueryOption = () => {
    const data = selectedOptions.map((option) => option.label).join(' ');
    console.log(query + ' ' + data);
  };

  //オプションが追加された時の動作
  const handleSelect = (_newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'select-option':
        if (actionMeta.option) {
          const catBreed = actionMeta.option;
          setSelectedOptions(prev => [...prev, catBreed]);
          break;
        }
        break;

      case 'remove-value':
        if (actionMeta.removedValue) {
          const toDeleteOption = actionMeta.removedValue;

          setSelectedOptions(prev =>
            prev.filter(
              currentOptions => currentOptions.value != toDeleteOption.value
            )
          );
          break;
        }
        break;
      case 'pop-value':
        if (actionMeta.removedValue) {
          const toDeleteOption = actionMeta.removedValue;

          setSelectedOptions(prev =>
            prev.filter(
              currentOptions => currentOptions.value != toDeleteOption.value
            )
          );
          break;
        }
        break;

      case 'clear':
        setSelectedOptions([]);
        break;
      default:
        break;
    }
  };

  //検索ボタンが押された時の動作
  const searchClicked = () => {
    concatQueryOption();
    console.log('start searching');
    setChatGPTText('Loading');
    //まず、データベース内からクエリとマッチする要素を検索
    console.log('searching in the DB');
    API.searchRestaurant(query, token['mr-token'])
      .then(resp => setSearchResult(resp))
      .catch(error => console.log(error));
  };

  //検索結果が得られたらその一つを選ぶ機構
  //TODO
  //今のままだと検索クエリとマッチした飲食店のうち、一番昔にデータベースに加えられたものを表示する形になってしまっている
  //これだと同じのしか表示されないので良い感じの方法で結果の多様性が出るよう改良
  useEffect(() => {
    if (searchResult && searchResult.length > 0) {
      setSelectedResult(searchResult[0]);
    } else if (
      chatGPTtext === 'Loading' &&
      searchResult &&
      searchResult.length == 0
    ) {
      //データベース内に該当するものが見当たらない場合,ホットペッパーAPIを叩いてデータベースを拡充
      API.hotpepperSearchRestaurant(query, token['mr-token'])
        .then(resp => console.log(resp))
        .catch(error => console.log(error));

      // その後, 再びデータベース内を検索
      API.searchRestaurant(query, token['mr-token'])
        .then(resp => setSearchResult(resp))
        .catch(error => console.log(error));

      //いくらやっても駄目ならそれはホットペッパーでもヒットしなかったということなので、無限ループ防止のため
      //なお、chatGPTtextを変えることで上のif文に引っかからなくして強制終了させている
      setCounter(counter + 1);
      if (counter === LIMIT) {
        setChatGPTText(
          `We are sorry to inform that no results are available from current query : "${query}"`
        );
        setCounter(0);
      }
    }
  }, [searchResult]);

  //検索結果の飲食店が得られたら、その飲食店の特徴をプロンプトにして、chatGPTに紹介文を生成してもらう
  useEffect(() => {
    console.log(`ChatGPT text : ${chatGPTtext}`);
    console.log(selectedResult);
    if (selectedResult) {
      console.log(selectedResult);
      async function fetchData() {
        setLoading(true);
        setError();
        console.log('id =');
        console.log(selectedResult.id);

        const data = await API.askChatGPT(
          selectedResult.id,
          token['mr-token']
        ).catch(err => setError(err));
        setChatGPTText(data.recommendation_text);
        console.log(data.recommendation_text);
        setSelectedResult(null);
        setSearchResult(null);
        setLoading(false);
      }
      fetchData();
    }
  }, [selectedResult]);

  const isDisabled = query.length === 0;

  return (
    <React.Fragment>
      <Box className="search-container" w="700px">
        <label htmlFor="query">Search Restaurant</label>
        <br />
        <HStack color="white">
          <Center w="230px">
            <input
              className="input"
              id="query"
              type="text"
              placeholder="地名/駅名・ジャンルを入力"
              value={query}
              onChange={evt => setQuery(evt.target.value)}
            />
          </Center>
          <Center w="400px" color="black">
            <FormControl p={4}>
              <Select
                isMulti
                placeholder="オプションを追加"
                options={groupedOptions}
                hideSelectedOptions={true}
                // value={selectedOptions1}
                closeMenuOnSelect={false}
                onChange={handleSelect}
                isSearchable={true}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? 'grey' : 'white',
                  }),
                }}
              />
            </FormControl>
          </Center>
          <Box>
            <button
              className="button"
              onClick={searchClicked}
              disabled={isDisabled}
            >
              Search
            </button>
            <button className="button" onClick={concatQueryOption}>テスト用</button>
          </Box>
        </HStack>

        <br />
      </Box>
      <Box className="search-result">
        <p>{chatGPTtext}</p>
      </Box>
    </React.Fragment>
  );
}

export default RestaurantSearch;
