const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mysql = require('mysql');
const helsana = require('./helsana_db')

var con = mysql.createConnection({
  host: "***REMOVED***",
  user: "***REMOVED***",
  password: "***REMOVED***",
  database: "somedb",
  port: '3306',
  ssl: true
});

function initialize(passport) {

  console.log("ello")

  passport.use(new LocalStrategy(
    {
      usernameField: 'email'
    }, (email, password, done) => {
      console.log('called local strategy');

      con.connect((err, client) => {
        console.log('called local strategy - in db connection');

        var user = {};
        var sql = `SELECT * FROM users WHERE email = '${email}'`;
        console.log(sql);

        con.query(sql, async function(err, result){
            if(err) console.log(err);
            else if(result.length != 0){ 
                console.log(result[0]);
                user = result[0];
            }
            else{
              return done(null, false, { message: 'No user with that email' })
            }
            try {
              if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
              } else {
                return done(null, false, { message: 'Password incorrect' })
              }
            } catch (e) {
              return done(e)
            }
        })
      });

    }));
  passport.serializeUser((user, done) => {
    done(null, user.ID);
  });
  passport.deserializeUser((ID, done) => {
    console.log('called deserializeUser method');
    con.connect((err, client) => {
      var user = {};
      console.log('called deserializeUser - in db connection');
      var sql = `SELECT * FROM users WHERE ID = '${ID}'`;
      console.log(sql);
      con.query(sql, function(err, result){
        if(err) console.log(err);
        else if(result.length != 0){ 
          console.log(result[0]);
          user = result[0];
          user.ikcal = 0;
          user.ifat = 0;
          user.iprotein = 0;
          user.iprotein = 0;
          user.activities = []
          user.kcal = parseInt(user.kcal);
          user.fat = parseInt(user.fat);
          user.protein = parseInt(user.protein);
          user.carbs = parseInt(user.carbs);
          done(null, user);
      }
        
      });
    });
  });
}
module.exports = initialize