import React, { Fragment, useState, useEffect, useCallback } from 'react'
import Slider from "../Slide/Slider";
import Carousel from "../Slide/SliderCarousel";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL,API_KEY,IMAGE_BASE_URL, USER_SERVER } from '../../Config.js';
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Layout  from "./Layout";
import GridCard from './GridCard';
import {Row} from 'antd';

function LandingPage() {
    const user = useSelector(state => state.user);
    const [last_Posts, setlastPosts] = useState([]);
    const [lastslide, setlastSlide] = useState(0); // 현재 슬라이드
    const [top_Posts, settopPosts] = useState([]);
    const [topslide, settopSlide] = useState(0);
    const [Movies, setMovies] =useState([]);
    const [MainMovieImage, setMainMovieImage] =useState(null);
    const [CurrentPage, setCurrentPage] = useState(0)

    // const handleLClickMove = useCallback((slideNum) => {
    //     setlastSlide(slideNum);
    // }, []);
    // const handleTClickMove = useCallback((slideNum) => {
    //     settopSlide(slideNum);
    // }, []);


    // useEffect(() => {
    //     axios
    //         .get(`${USER_SERVER}/novel/list/1`)
    //         .then(({ data }) => { setlastPosts(data.slice(0, 10));});

    // }, [])
    // useEffect(() => {
    //     axios
    //         .get(`${USER_SERVER}/novel/list/view/0`)
    //         .then(({ data }) => { settopPosts(data.slice(0, 10));});

    // }, [])
    useEffect(()=> {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)
    },[])


    const fetchMovies=(endpoint)=>{
        fetch(endpoint)
        .then(response=>response.json())
        .then(response=>{
            
            setMovies([...response.results])
            setMainMovieImage(response.results[0])
            setCurrentPage(response.page)
            })
    }
    const loadMoreItems=()=>{
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage +1}`
        fetchMovies(endpoint)
    }
    const loadPreviousItems=()=>{
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage -1}`
        fetchMovies(endpoint)
    }
    

    //console.log(MainMovieImage.backdrop_path)
    return (
        <Fragment>
        {MainMovieImage && console.log(MainMovieImage),
            <Slider /> }
            <div style={{width : '85%', margin:'1rem auto'}}>
                <h2>Movies by latest</h2>
                <hr/>

            <Row gutter={[16,16]}>
                {Movies && Movies.map((movie, index)=>(
                    <React.Fragment key={index}>
                        <GridCard image={movie.poster_path ? 
                            `${IMAGE_BASE_URL}w500${movie.poster_path}`:null}
                            movieId={movie.id}
                            movieName={movie.original_title}
                            />
                    </React.Fragment>
                 ) )}
                
            </Row>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <button onClick={loadMoreItems}>load</button>
            </div>
            { CurrentPage>=2 &&
            <div style={{display:'flex',justifyContent:'center'}}>
            <button onClick={loadPreviousItems}>Previous</button>
            </div>
            }
            <Layout/>
   
        </Fragment>
    );
}


const Container = styled.div`
  min-height: 100vh;
  padding: 50px 100px 0 0px;
  display: grid;
  grid-template-columns: repeat(10, 200px);
  grid-template-rows: repeat(auto-fit, 300px);
  grid-auto-rows: 300px;
  grid-gap: 30px 85px;
  justify-content: center;
  box-sizing: border-box;
  margin: 1px 0 100px 10px
`;
const Post = styled.div`
  border: 1px solid black;
  background: #E2ECFF;
  align-items: center;
  margin:  0 0 0 35%;
  padding: 0px 10px;
  border-radius:8px;
`;

const Title = styled.div`
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px black;
`;

const Body = styled.div`
  height: 80%;
  padding: 11px;
  border-radius: 20px;
  
`;

export default LandingPage
