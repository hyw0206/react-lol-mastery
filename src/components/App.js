import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { findChampion } from '../Modules/FunctionModule';
import "../styles/app.css"
function App() {
  // useState로 state 세팅
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [mastery, setMastery] = useState(null);
  const [search, setSearch] = useState('');
  // 변수 세팅
  const api_key = "api_key";
  const inputEl = useRef(null);
  const totalMasteryPoint = () => {
    let total = 0;
    for (let i = 0; i < mastery.length; i++) {
      total += mastery[i].championPoints;
    }
    return total;
  }
  const totalMasteryLevel = () => {
    let total = 0;
    for (let i = 0; i < mastery.length; i++) {
      total += mastery[i].championLevel;
    }
    return total;
  }
  const fetch = async (nickname = "hide on bush") => {
    try {
      // 데이터 초기화
      setUsers(null);
      setMastery(null);
      setLoading(true);
      // 기본 데이터 받아오기
      const response = await axios.get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${api_key}`
      )
      setUsers(response.data)
      const summonerId = response.data.id;
      // summoner의 mastery data 받아오기
      const masteryResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/top?count=162&&api_key=${api_key}`
      )
      setMastery(masteryResponse.data)
    } catch (e) {
      alert("소환사 이름을 제대로 입력해주세요! \n만약 2글자 닉네임이라면, 띄어쓰기도 포함해주세요. \n정상적인 이용을 위해 새로고침을 진행합니다.");
      setLoading(false);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
    setLoading(false)
  }
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);
  const sendNickName = () => {
    if (inputEl.current.value === '' || inputEl.current.value.length <= 2) {
      alert("소환사 이름을 제대로 입력해주세요!");
      console.log(inputEl.current.value);
    }
    else fetch(inputEl.current.value);
  }
  if (loading) return <div className="loading">로딩중..</div>;
  if (!users) return null;
  
  return (
    <div className="App">
      <a href="#top"><div className="sidebar">Go Top</div></a>
      <div className="send-nickname">
        <input minLength={2} placeholder='소환사의 이름을 입력해주세요. (2글자 닉네임은 띄어쓰기 포함)' ref={inputEl}></input>
        <button onClick={sendNickName}>전송</button>
      </div>
      <div className="wrapper">
        <div className="summoner-info">
          <div>소환사의 이름 : {users.name} </div>
          <div>소환사의 레벨 : {users.summonerLevel}</div>
          <div>총 숙련도 : {totalMasteryPoint().toLocaleString()} Point</div>
          <div>총 숙련도 레벨 : {totalMasteryLevel()}</div>
        </div>
      </div>
      
      <h2 className="title" id="mastery">숙련도 정보</h2>
      <div className="search-mastery">
        <input type="texy" placeholder='숙련도 검색' onChange={(e)=>{setSearch(e.target.value)}}></input>
      </div>
      <div className="mastery-wrap">
        <div className="summoner-mastery">
          <div className="mastery-head">
            <div className="most">순위</div>
            <div className="champion">챔피언</div>
            <div className="level">레벨</div>
            <div className="suko">숙련도</div>
          </div>
          {mastery.length >= 5 ?
          // eslint-disable-next-line
            mastery.filter((data) => {
              if (search === "") {
                return data;
              } else if (findChampion(data.championId).includes(search)) {
                return data;
              }
            }).map(function (data, index){
              return (
                <div key={index + 10000} className="summoner-mastery-info">
                  <div className="most"key={index + 1000}>{index + 1}</div>
                  <div className="champion"key={index + 5}>{findChampion(data.championId)}</div>
                  <div className="level"key={index + 200}>{data.championLevel}</div>
                  <div className="suko"key={index + 100}>{data.championPoints.toLocaleString()} Point</div>
                </div>
              );
            })  : <><div>숙련도 데이터가 모자랍니다. </div> <i>숙련도 데이터가 5개 미만입니다.</i></>}
        </div>
        
      </div>
    </div>
  );
}
export default App;