import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import { USER_SERVER } from '../../../components/Config.js';
import { useParams } from 'react-router';
import { Descriptions } from 'antd';


//해당하는 장르 작품 출력 페이지
function GenrePage() {
    
  const [Posts, setPosts] = useState([]);
  const [Pages, setPages] = useState([1]);
  const params = useParams();

  const url=params.genre.toString();

  useEffect(() => {
    axios
      .get(`${USER_SERVER}/novel/genrelist/${url}/0`)
      .then(({ data }) => { setPosts(data); });
  }, [url])

  //소설 포스트 페이지 갱신
  const fetchNovel = () => {
      
    setPages(Number(Pages)+1);

    fetch(`${USER_SERVER}/novel/genrelist/${url}/${Pages}`)
          .then(response => response.json())
          .then(response => {
              console.log(response)
              setPosts([...Posts, ...response])    
    })
  }

  return (
    <div>
      <Descriptions title={url} bordered style={{margin:'0% 25% auto'}}>
      </Descriptions>
      <Container>
        <GlobalStyle />
        {Posts.map((data, index) => (
          <Post key={index}>
            <a href={`/novel/${data.id}`}>
            <Body>
              {/* 작품 표지 이미지 url */}
              <Img>
                <img src = {`${data.imgurl}`} alt = {data.title} width = '200' height = '280' align = 'center' ></img> 
              </Img>
              <Effcet/>
            </Body>
            {/* 작품 타이틀*/}
            <Title>{data.title}</Title>
            </a>
          </Post>  
        ))}
      </Container>
      {/*Load More 방식 - 페이지 갱신*/}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadButton onClick={fetchNovel}>Load More</LoadButton>
      </div>
    </div> 
  );
}

//스타일 영역
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 50px 0;
  display: grid;
  grid-template-columns: repeat(5, 200px);
  grid-gap: 20px 50px;
  justify-content: center;
  box-sizing: border-box;
`;

const Post = styled.div`
  a:link { color: black; font-weight: bold;}
  a:visited { color: purple; font-weight: bold;}
  a:hover { color: #f4ac19; font-weight: bold;}
  position: relative;
`;
const Img = styled.div`
  border: 1px solid black;
`;

const Title = styled.div`
  padding: 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body = styled.div`
  padding: 2px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Effcet = styled.div`
  border: 2px solid black;
  height: 270px;
  position: relative;
`;

const LoadButton = styled.button`
  padding: 6px 12px;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  background-color: #DCDCDC;
  :hover {
    background-color: #F5F5F5;
  }
  cursor: pointer;
`;

export default GenrePage
