import React from 'react'
import {Col} from 'antd';

function GridCard(props) {
  return (
<Col lg={6} md={3} xs={24}>
<div style={{position:'relative'}}>
        <a href={`/movie/${props.movieId}`}>
            <img style={{width :'100%', height:'320px'}} src={props.image} alt={props.movieName}></img>
        </a>
    </div>
    </Col>
  )
}

export default GridCard
