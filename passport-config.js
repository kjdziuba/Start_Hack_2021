const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "***REMOVED***",
  user: "***REMOVED***",
  password: "***REMOVED***",
  database: "somedb",
  port: '3306',
  ssl: true
});

function initialize(passport) {

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
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    console.log('called deserializeUser method');
    con.connect((err, client) => {
      var user = {};
      console.log('called deserializeUser - in db connection');
      var sql = `SELECT * FROM users WHERE id = ${id}`;
      console.log(sql);
      con.query(sql, function(err, result){
        if(err) console.log(err);
        else if(result.length != 0){ 
          console.log(result[0]);
          user = result[0];
          done(null, user);
      }
        
      });
    });
  });
}
module.exports = initialize