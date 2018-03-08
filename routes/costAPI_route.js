const moment = require('moment');
// const emailAPI = require('./email_api.js');

module.exports = (app,db)=> {return {
  createRoutes : (table,route)=>{
    app.get(route,(req,res)=>{
      // Searches for user's fixed costs.
      // console.log(route + ' requested by User ' + req.user + ' authenticated?=>' + req.isAuthenticated());
      // if (req.user && req.isAuthenticated()) {
        var query = {};
        // query.clientid = req.user;
        query.clientid = 2;
        db[table].findAll({
          where: query,
          include: [db.clients]
        })
        .then((dbResp)=>{
          // console.log(dbResp);
          res.json(dbResp);
        }).catch((err)=>{
          console.log(err);
          res.status(500).end();
        });
      // }
      // else{
      //   ErrorMessage(res);
      // }
    });

    app.delete(route,(req,res)=>{
      // if (req.user && req.isAuthenticated()){
        // console.log('deleting ' + req.query.id  + ' by ' + req.user);
        // db[table].destroy({ where : { id : req.query.id, clientid : req.user } })
        db[table].destroy({ where : { id : req.query.id, clientid : 2 } })
        .then((dbResp)=>{
          res.json(dbResp);
        }).catch((err)=>{
          console.log(err);
          res.status(500).end();
        });
      // }
      // else{
      //   ErrorMessage(res);
      // }
    });

    app.put(route,(req,res)=>{
      // if(req.user && req.isAuthenticated()){
        // db[table].update(req.body, { where : { id : req.query.id, clientid : req.user } })
        db[table].update(req.body, { where : { id: req.body.id, clientid : 2 } })
        .then((dbResp)=>{
          // dbTrigger(db,req);
          res.json(dbResp);
        }).catch((err)=>{
          console.log(err);
          res.status(500).end();
        });
      // }else{
      //   ErrorMessage(res);
      // }
    });

    app.post(route,(req,res)=>{
      // if(req.user && req.isAuthenticated()){
        const newItem = req.body;
        // newItem.clientid = req.user;
        newItem.clientid = 2;
        db[table].create(newItem).then((dbResp)=>{
          // dbTrigger(db,req);
          res.json(dbResp);
        }).catch((err)=>{
          console.log(err);
          res.status(500).end();
        });
      // }else{
      //   ErrorMessage(res);
      // }
    });
  }
}};


// Updates current month's spending
// function dbTrigger(db,req){
//   db.clients.findOne( { where: { id : req.user } }).then((clientResp)=>{
//     db.flexspend.findAll( { where: { clientid : req.user,
//       createdAt : { $gte: moment().subtract(1, 'months').toDate() }
//     } }).then((flexResp)=>{
//       db.goals.findAll( { where : { clientid : req.user }
//       }).then((goalsResp)=>{
//         db.fixedcosts.findAll( { where : { clientid : req.user }
//         }).then((fixResp)=>{
//           console.log('sucesss!!! user=>'+ JSON.stringify(clientResp,null,4) +', flexspend =>' + JSON.stringify(flexResp,null,4) + ', goalsResp =>' + JSON.stringify(goalsResp,null,4) + ', fixResp =>' + JSON.stringify(fixResp,null,4));
//
//           if(true){ // Capability of sending email
//             // Send email if monthly expenses are over 90% of income.
//             var month_expense = 0.00;
//             fixResp.forEach((value)=>{
//               month_expense += parseFloat(value.cost);
//             });
//             flexResp.forEach((value)=>{
//               month_expense += parseFloat(value.cost);
//             });
//             goalsResp.forEach((value)=>{
//               month_expense += parseFloat(value.cost);
//             });
//
//             console.log('Month Expense: $' + month_expense);
//             // Send warning email that monthly expense is near exceeding monthly income.
//             if( month_expense  >= parseFloat(clientResp.monthly_income) * parseFloat(clientResp.reminder)){
//               const subject = 'Friendly Reminder: Your current month\'s expenses is almost exhausting your entire month\'s income.'
//               var message = '<p>Hi ' + clientResp.client_name + ',</p><p>\tSlow down your spending this month. You are nearly exhausting your entire monthly income you earned this month. Your monthly expenses is currently at $' + month_expense + ' while your current monthly income is $' + clientResp.monthly_income + '.</p><p>Thank you for using our app. </p><p>Sincerely,<br />Saving Salmon</p>';
//               emailAPI.send(subject,message,clientResp.email);
//             }
//
//           }
//
//         });
//       });
//     });
//   });
// }


function ErrorMessage(res){
  res.json({messaged: 'You are not logged in'});
}
