const express = require('express')
const path = require('path');
const router = express.Router();

const recommend = require('../lib/recommend/recommend_main')

module.exports = (pool) => {
    //조회수 증가 API
    router.get('/hit/:novel_id', (req, res, next) =>{
        const novel_id = path.parse(req.params.novel_id).base;

        let sql = 'SELECT hit FROM novel_hitdata WHERE id = ?';
        pool.query(sql, [novel_id], (err, results) =>{
            if(err) {
                console.log(err);
                return next(err);
            }
            const cur_hit = results[0]['hit']
            sql = `UPDATE novel_hitdata SET hit = ${cur_hit} + 1 WHERE id = ?`
            pool.query(sql, [novel_id]);

        });
    });

    // 작품 상세정보 출력
    // API : '/novel/noveldata/[num]'
    router.get('/noveldata/:novel_id', (req, res, next) => {
        //패러미터 파싱
        const novel_id = path.parse(req.params.novel_id).base;
        //메인 쿼리
        //id, title, imgurl, genre, description, author_id, name
        const data_sql = 'SELECT d.id, d.title, d.imgurl,\
                d.genre, d.description, d.author_id, au.name \
                FROM novel_data AS d JOIN author AS au \
                ON d.author_id = au.id WHERE d.id=?;';
        const link_sql = 'SELECT url FROM novel_link WHERE nid = ?;';
        const tag_sql = 'SELECT tag FROM novel_tag WHERE nid = ?;'
        pool.query(data_sql + link_sql + tag_sql, [novel_id, novel_id, novel_id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                const result_data = { ...results[0][0], urls: results[1], tags: results[2] };
                res.send(result_data);
            });
    });


    // 소설 최신 리스트 출력
    // API: '/novel/list/[num]'
    router.get('/list/:id', (req, res, next) => {
        const pageId = path.parse(req.params.id).base * 20;

        const sql = 'SELECT id,title,imgurl FROM novel_data ORDER BY id DESC LIMIT ?,20';
        pool.query(sql, [pageId], (err, results) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.send(results);
        });
    });


    // 장르 별 소설 리스트 출력
    //API: '/novel/genrelist/[genre]/[page_id]'
    router.get('/genrelist/:genre/:id', (req, res, next) => {
        const pageId = path.parse(req.params.id).base * 20;
        const genre = path.parse(req.params.genre).base;

        const sql = 'SELECT id,title,imgurl FROM novel_data WHERE genre=? ORDER BY id DESC LIMIT ?,20';
        pool.query(sql, [genre, pageId], (err, results) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.send(results);
        });
    });


    //평점 준 작품 소설 리스트 출력
    router.get('/mybook/:uid/:id', (req, res, next) => {
        const uid = path.parse(req.params.uid).base;
        const pageId = path.parse(req.params.id).base * 20;

        const sql = `SELECT id, title, imgurl FROM novel_data where id in (select nid from novel_scoredata where uid=?) LIMIT ?, 20`;
        pool.query(sql, [uid, pageId], (err, results) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.send(results);
        });
    });


    //평점 준 작가 기반 소설 리스트 출력
    router.get('/relatedbook/:uid/:id', (req, res, next) => {
        const uid = path.parse(req.params.uid).base;
        const pageId = path.parse(req.params.id).base * 20;
        
        const sql = `SELECT id, title, imgurl FROM novel_data WHERE author_id in (SELECT author_id FROM novel_data WHERE id in (SELECT nid FROM novel_scoredata WHERE uid=?)) LIMIT ?, 20`
        pool.query(sql, [uid, pageId], (err, results) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.send(results);
        });
    });
    

    //조회수 기반 소설 리스트 출력
    router.get('/list/view/:id', (req, res, next) => {
        const pageId = path.parse(req.params.id).base * 20;

        const sql = `SELECT d.id, d.title, d.imgurl FROM novel_data as d LEFT JOIN novel_hitdata ON d.id = novel_hitdata.id ORDER BY hit DESC, id DESC LIMIT ?, 20`;
        pool.query(sql, [pageId], (err, results) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.send(results);
        });
    });


    //추천 알고리즘 기반 소설 리스트 출력
    router.get('/content-rec/:uid', async (req, res, next) =>{
        const userId = path.parse(req.params.uid).base;
        if(userId == ""){
            return next();
        }
        
        // 추천 알고리즘 호출
        var result = await recommend(userId);

        res.send(result);
    });

    return router;
}