const mysql = require('mysql');
let client = undefined;

/**
 * db用于数据库相关操作，如插入、获取
 */

//数据库命令传输
const query = function (sql,cb) {
    // console.log("query = " + sql);
    client.getConnection((err,connection)=> {
        if (err) {
            console.log("get connection = " + err);
            cb(err);
            throw err;
        } else {
            connection.query(sql,(connErr,result)=> {
                if (connErr) {
                    console.log(sql + connErr);
                    cb(connErr);
                } else {
                    if (cb) {
                        cb(null,result);
                    }
                }
                connection.release();
            })
        }
    })
};

//获取玩家信息（根据accountID）
exports.getPlayerInfoWithAccountID = function (key, cb) {
    let sql = 'select * from t_account where account_id = ' + key + ';';
    query(sql, cb);
};

//获取玩家信息（根据uniqueID）
exports.getPlayerInfoWithUniqueID = function (key, cb) {
    let sql = 'select * from t_account where unique_id = ' + key + ';';
    query(sql,cb);
};
// create table t_account(unique_id varchar(20),account_id varchar(20),nick_name varchar(255),gold_count int,avatar_url varchar(255));
//创建玩家信息
exports.createPlayerInfo = function (uniqueID, accountID, nickName, goldCount, avatarUrl) {
    let sql = 'insert into t_account(unique_id, account_id, nick_name,gold_count, avatar_url) values('
        + "'" +uniqueID + "'" + ','
        + "'" + accountID + "'" + ','
        + "'" +nickName + "'" + ','
        + "'" + goldCount + "'" +','
        + "'" + avatarUrl + "'" + ');' ;

    query(sql, (err, data)=>{
        if (err){
            console.log('create player info = ' + err);
        }else
        {
            // console.log('create player info = ' + JSON.stringify(data));
        }
    });
};

// 连接服务器
exports.connect = function (config) {
    client = mysql.createPool(config);
};