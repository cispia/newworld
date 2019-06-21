var express = require('express');
var router = express.Router();
var pool = require("./pool");
// 搜索小说
router.post('/seatch', function (req, res) {
    var json = req.body.hotkey;
    console.log(json);
    pool.conn({
        sql: 'select * from createbook where name like "%' + json + '%" or author like "%' + json + '%"',
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 刷新评论
router.get('/pload', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: 'select * from pl where bookid=' + json.pl,
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 刷新章节
router.get('/load', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: 'select * from chap where bookid=?',
        arr: [json.uid],
        success(data) {
            if (data.length) {
                var result = data;
                res.send(result);
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 删除章节
router.get('/del', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from chap where uid=" + json.uid,
        success(data) {
            if (data == []) {
                res.send("没有数据");
            }
            pool.conn({
                sql: "select * from content where chapid=" + data[0].uid,
                success(data) {
                    if (data == []) {
                        res.send("没有数据了");
                    }
                    pool.conn({
                        sql: "delete from chap where uid=" + json.uid,
                        success(data) {
                            pool.conn({
                                sql: "delete from content where chapid=" + json.uid,
                                success(data) {
                                    res.send("删除成功");
                                },
                                error(err) {
                                    res.send(err);
                                }
                            })
                        },
                        error(err) {
                            res.send(err);
                        }
                    });
                },
                error(err) {
                    res.send(err);
                }
            });
        },
        error(err) {
            res.send(err);
        }
    })
});
// 删除章节
router.get('/delbook', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from chap where uid=" + json.uid,
        success(data) {
            pool.conn({
                sql: "delete from createbook where uid=" + json.uid,
                success(data) {
                    res.send("删除成功");
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
// // 修改个人信息
// router.post('/updat', function (req, res) {
//     var json = req.body;
//     // if(json==null) return;
//     pool.conn({
//         sql: "update login set name=?,img=? where uid=?",
//         arr: [json.nicheng, json.img, json.uid],
//         success(data) {
//             res.send("修改成功");
//         },
//         error(err) {
//             res.send(err);
//         }
//     })
// });
// 热搜
router.post('/resou', function (req, res) {
    pool.conn({
        sql: 'select * from createbook',
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 查询收藏书的bookid
router.get('/selectbookid', function (req, res) {
    var json=req.query;
    pool.conn({
        sql: "select * from createbook where uid=?",
        arr:[json.uid],
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 添加收藏
router.post('/collect', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "select * from collection where loginid=? and bookid=?",
        arr:[json.logid,json.bookid],
        success(data) {
            if (data.length) {
                res.send("此书已收藏");
            } else {
                pool.conn({
                    sql: "insert into collection(name,author,bookimg,loginid,bookid) values(?,?,?,?,?)",
                    arr: [json.name, json.auth, json.bookimg, json.logid, json.bookid],
                    success(data) {
                        res.send("收藏成功");
                    },
                    error(err) {
                        res.send(err);
                    }
                })
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 书架收藏
router.get('/booklist', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: 'select * from collection where loginid=?',
        arr: [json.logid],
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 删除收藏
router.get('/delcol', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: 'delete from collection where uid=?',
        arr: [json.logid],
        success(data) {
            res.send("删除成功!");
        },
        error(err) {
            res.send(err);
        }
    })
});
//评论
router.post('/insert', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: 'insert into pl(user,img,text_pl,bookid) values(?,?,?,?)',
        arr: [json.user, json.img, json.pltext, json.bookid],
        success(data) {
            pool.conn({
                sql: 'select * from pl where bookid=? order by uid desc',
                arr: [json.bookid],
                success(data) {
                    res.send(data);
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
// 已创建的小说
router.get('/loguid', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: 'select * from createbook where loginid=?',
        arr: [json.logid],
        success(data) {
            if (data.length) {
                var result = data;
                res.send(result);
            } else {
                res.send("没有数据了");
            }
        },
        error(err) {
            res.send(err);
        }
    })
})
// 章节列表
router.get('/chaplist', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from chap where bookid=?",
        arr: [json.mybook],
        success(data) {
            if (data.length) {
                var result = data;
                res.send(result);
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 阅读
router.get('/read', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from content where chapid=?",
        arr: [json.chapid],
        success(data) {
            if (data.length) {
                var result = data;
                res.send(result);
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 详情章节列表
router.post('/bookid', function (req, res) {
    var json = req.body;
    // console.log(json)
    pool.conn({
        sql: "select * from chap where  bookid=?",
        arr: [json.bookid],
        success(data) {
            res.send(data);
        },
        error(err) {
            res.send(err);
        }
    })
});
//修改章节
router.get('/chapreset', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from chap where uid=?",
        arr: [json.uid],
        success(data) {
            res.send(data[0]);
        },
        error(err) {
            res.send(err);
        }
    })
});
// 修改内容
router.post('/update', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "update chap set name=? where uid=?",
        arr: [json.name, json.uid],
        success(data) {
            pool.conn({
                sql: "update content set text=? where uid=?",
                arr: [json.ctext, json.cuid],
                success(data) {
                    res.send("修改完成");
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
//修改章节
router.get('/contentreset', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from content where chapid=?",
        arr: [json.uid],
        success(data) {
            res.send(data[0]);
        },
        error(err) {
            res.send(err);
        }
    })
});
//创建章节
router.post('/chapup', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "insert into chap(name,bookid) values(?,?)",
        arr: [json.name, json.bookid],
        success(data) {
            pool.conn({
                sql: "select * from chap where  bookid=?",
                arr: [json.bookid],
                success(data) {
                    res.send(data);
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
// 创建内容
router.post('/content', function (req, res) {
    var json = req.body;
    console.log(json)
    pool.conn({
        sql: "insert into content(chapid,text) values(?,?)",
        arr: [json.chap, json.text],
        success(data) {
            res.send("发布成功");
        },
        error(err) {
            res.send(err);
        }
    })
});
// //更新小说的rs次数
// router.get("/uprsid",(req,res)=>{
//     var json=req.query;
//     pool.conn({
//         sql: "update createbook set rsid=? where uid=?",
//         arr: [json.rsid, json.uid],
//         success(data) {
//             res.send("点击率以增加");
//         },
//         error(err) {
//             res.send(err);
//         }
//     })
// })
// 创建书名
router.post('/bookup', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "insert into createbook(name,author,briefing,bookimg,loginid,rsid) values(?,?,?,?,?,1)",
        arr: [json.bookname, json.author, json.briefing, json.bookimgurl, json.useruid],
        success(data) {
            pool.conn({
                sql: "select * from createbook where loginid=?",
                arr: [json.useruid],
                success(data) {
                    res.send(data);
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
// 注册
router.post('/up', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "select user from login where user=?",
        arr: [json.user],
        success(data) {
            if (data.length) {
                res.send("账号已存在");
            } else {
                pool.conn({
                    sql: "insert into login(name,user,pass,img) values(?,?,?,?)",
                    arr: [json.name, json.user, json.pass, json.userimg],
                    success(data) {
                        res.send("注册成功");
                    },
                    error(err) {
                        res.send(err);
                    }
                })
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 登录
router.post('/in', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "select * from login where user=? and pass=?",
        arr: [json.user, json.pass],
        success(data) {
            if (data.length) {
                var result = data[0];
                result.tip = "登录成功";
                result.pwd = "";
                res.send(result);
            } else {
                return;
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
module.exports = router;