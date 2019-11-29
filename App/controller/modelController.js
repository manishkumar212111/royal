

const modelController = {
    findInDb : function(condition, tableName, fields, delimeter = ' OR ') {
        return new Promise(async function(resolve, reject) {
            try {
                if (!condition) {
                    return reject('please provide condition');
                }
                let conditionArray = [];
                let valueArray = [];
                for (var key in condition) {
                    if (condition.hasOwnProperty(key)) {
                        conditionArray.push(key + ' = ?');
                        valueArray.push(condition[key]);
                    }
                }
                let query = `SELECT ${fields.join()} FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
                let result = await executeQuery(query, valueArray);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    fetchFromDb : function(tableName, fields , limit) {
        return new Promise(async function(resolve, reject) {
            try {
                let query = `SELECT ${fields.join()} FROM ${tableName}`;
                if(limit){
                    query += ` limit ${limit}`
                }
                let result = await executeQuery(query, []);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    fetchFromDbInRange : function(tableName, fields , limit , range) {
        return new Promise(async function(resolve, reject) {
            try {
                let query = `SELECT ${fields.join()} FROM ${tableName}`;
                let initialValue = limit * range;
                query += ` limit ${initialValue},${ initialValue+limit }`
                let result = await executeQuery(query, []);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    insertIntoDb : function(tableName, fields) {
        return new Promise(async function(resolve, reject) {
            try{
                let query = `INSERT INTO ${tableName} `;
                let valueArray = [];
                let columnValue = [];
                let symboleValue = [];
                for (var key in fields) {
                 if (fields.hasOwnProperty(key)) {
                   columnValue.push(key);
                   symboleValue.push('?');
                   valueArray.push(fields[key]);
                 }
                }
               query += '(`'+columnValue.join("`, `")+'`) VALUES ('+symboleValue.join(", ")+')';
               let result = await executeQuery(query,valueArray); 
                 resolve((result.insertId||0));
               }catch(e){
                 reject(e);
               }
        });
    },
    fetchCountDb : function(tableName, fields , limit) {
        return new Promise(async function(resolve, reject) {
            try {
                let query = `SELECT count(id) as count FROM ${tableName}`;
                let result = await executeQuery(query, []);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    },
    updateTable : function(updateObject, tableName, id, whereColumnName = 'id'){
        return new Promise( async function(resolve, reject) {
          try{
             let query = `UPDATE ${tableName} SET `;
             let valueArray = [];
             let columnValue = [];
             for (var key in updateObject) {
              if (updateObject.hasOwnProperty(key)) {
                columnValue.push('`'+key+'` = ? ');
                valueArray.push(updateObject[key]);
              }
             }
            query += columnValue.join(", ")+` where ${whereColumnName} = ? `;
            valueArray.push(id);
            let result = await executeQuery(query,valueArray); 
            resolve(result.changedRows || 0);
          }catch(e){
            reject(e);
          }
        });
    }
    
}

module.exports = modelController;