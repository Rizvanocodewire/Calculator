const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const math = require("mathjs");

const http = require("http");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.render(__dirname + "/template/demo.html");
});

//Mutual fund claculator get method for render the page in the browser

app.get("/mutual", (req, res) => {
  res.render(__dirname + "/template/mutul_calculator.html", {total_invesment:"",year:"",total_estimated_return:"",
    return_rate:"",
    future_value: "",
  });
});

//after render page you can use these steps for performing any type of calculation related mutual fund

app.post("/mutual", (req, res) => {
  // total_ invesment
  const total_invesment = parseInt(req.body.loan);
  // number of year
  const year = parseInt(req.body.year);
  // Expected return rate
  const return_rate = parseInt(req.body.return);
  // console.log(return_rate, "rrrrrrrrrrrrr");

  //
  //Estimated return rate
  const estimated_return = 1 + return_rate / 100;
  // total estimated return rate
  const total_estimated_return =parseInt( math.pow(estimated_return, year));
  // and finally find the total future value with expected return rate
  const future_value = parseInt(total_invesment * total_estimated_return);

  res.render(__dirname + "/template/mutul_calculator.html", {total_invesment:total_invesment,year:year,
    return_rate:return_rate,future_value: future_value,total_estimated_return:total_estimated_return,
  });
});
// sip calculator
app.get("/sip", (req, res) => {
  res.render(__dirname + "/template/SIP_Calculator.html", {total_invesment:"",numberOfYears:"",totalReturnRate:"", total_amount:"", FutureValue: ""  });
});

// calculation for sip calculator in nodejs

app.post("/sip", (req, res) => {
  const total_invesment = parseInt(req.body.total_invesment);
  const numberOfYears = parseInt(req.body.year);
  const totalReturnRate = parseInt(req.body.return_rate);

  const months = numberOfYears * 12;
  const total_amount=total_invesment*months;
  const i = totalReturnRate / months / 100;
  console.log(i, "iiiiiii");

  // FV = 2000 * [(1+0.01) ^24 - 1] * (1+0.01)/0.01

  const i1 = 1 + i;
  // const months1 = months - 1;

  const m = math.pow(i1, months) - 1;
  const FutureValue = (total_invesment * (m / i) * i1);
  // console.log(t, "tttttttttttttttt");
  res.render(__dirname + "/template/SIP_Calculator.html", {total_invesment:total_invesment,numberOfYears:numberOfYears,totalReturnRate:totalReturnRate,total_amount:total_amount, FutureValue: FutureValue });
});
// emi calculator

app.get("/emi", (req, res) => {
  res.render(__dirname + "/template/design_calculator.html", {
    amount: "",
    interest: "",
    year: "",
    emi: "",
    total_amount: "",
  });
});

app.post("/emi", (req, res) => {
  const amount = parseInt(req.body.loan);
  const interest = parseInt(req.body.interest);
  const year = parseInt(req.body.year);
  const month = parseInt(year * 12);

  const total_interest = amount * interest;
  const one_yeari = total_interest / 100;
  // console.log(one_yeari);
  const total_amount = one_yeari + amount;
  // console.log(total_amount, "total_amount");
  const emi = parseInt(total_amount / month);
  // console.log(emi, "emirrrrrrrrrrrrrrrrrrrrrr");
  res.render(__dirname + "/template/design_calculator.html", {
    amount: amount,
    interest: interest,
    year: year,
    emi: emi,
    total_amount: total_amount,
  });
});
//  Lump sum calculator
app.get("/lump", (req, res) => {
  res.render(__dirname + "/template/Lump_Sum.html", {total_amount:"",year:"",return_rate:"",
    total_value: "",
    totalWealthGain: "",
  });
});

// caculation ff lump sum calculator
app.post("/lump", (req, res) => {
  const total_amount = parseInt(req.body.total_invesment);
  const year = parseInt(req.body.year);
  const return_rate = parseInt(req.body.return_rate);
  const return1 = return_rate / 100;

  const estimated_return = 1 + return1;
  const total_estimated_return = math.pow(estimated_return, year);

  // the future value after Invesment
  const total_value = parseInt(total_amount * total_estimated_return);
  // console.log(total_value, "fffffffffffff");
  const totalWealthGain = parseInt(total_value - total_amount);
  // console.log(totalWealthGain, "wwwwwwwwwwwwww");
  res.render(__dirname + "/template/Lump_Sum.html", {total_amount:total_amount,year:year,return_rate:return_rate
    ,total_value: total_value,
    totalWealthGain: totalWealthGain,
  });
});

//ppf Calculator

app.get("/ppf", (req, res) => {
  res.render(__dirname + "/template/ppf_calculator.html", {mature_amount:"",total_amount:"",return_rate:"",year:"", amount: "" });
});

//  Calculation of ppf calculator

app.post("/ppf", (req, res) => {
  const total_amount = parseInt(req.body.total_invesment);
  const year = parseInt(req.body.year);
  const return_rate = parseInt(req.body.return_rate)/100;
  // const interest1 = return_rate / 100;
  const mature_amount=total_amount*year
  console.log(mature_amount,'mature')
  // P[({(1+i)^n}-1)/i]
  let interest =0;
  let amount1=0;
 
  
  for ( i=1;i<=year;i++){
    let  i=total_amount*return_rate
    interest=interest+i;
   amount1=total_amount+interest;


  }
  // console.log(i,'iii')
console.log(interest,'inter');
console.log(amount1,'amount1')

const amount=amount1+mature_amount

 
  res.render(__dirname + "/template/ppf_calculator.html", {mature_amount:mature_amount, total_amount:total_amount,return_rate:return_rate,year:year,amount: amount });
});
//
//
// swp calculator
app.get("/swp", (req, res) => {
  res.render(__dirname + "/template/swp_calculator.html");
});

// Calculation of SWP calculator
// Formula for calculate swp A = PMT ((1+r/n)^nt – 1) / (r/n))

app.post("/swp", (req, res) => {
  const total_invesment = parseInt(req.body.total_invesment);
  const withdrawal = parseInt(req.body.withdrawal);
  const year = parseInt(req.body.year);
  const month = year * 12;
  const return_rate = parseInt(req.body.return_rate) / 100;

  const w = 1 + return_rate / (1 / 12);
  const s = (1 / 12) * month - 1;
  const p = return_rate / (1 / 12);
  const swp = math.pow(w, s);

  const future = (withdrawal * swp) / p;
  console.log(future, "ffffffff");
});
//
//
// FD Calculator
app.get("/fd", (req, res) => {
  res.render(__dirname + "/template/fd_calculator.html",{principle:"",total_amount:"",Year:"",rate_of_intrest:"",future:""});
});
//  calculation of fd calculator
app.post("/fd", (req, res) => {
  // formula => A=P(1+r/n)^n*t in this calculation i am using this formula
  let total_amount = parseInt(req.body.total_invesment);
  let Year = parseInt(req.body.year);
  let rate_of_intrest = parseInt(req.body.return_rate) ;

  const principle=total_amount*Year;

//  let per_year=total_amount*rate_of_intrest
 let future=parseInt(total_amount+(total_amount*rate_of_intrest*Year/100));
//  console.log(per_year,'per year');
 console.log(future,'par')

 
  // console.log(Maturity, "fffffffffffdddddddddd");
  res.render(__dirname + "/template/fd_calculator.html",{total_amount:total_amount,Year:Year,rate_of_intrest:rate_of_intrest,principle:principle,future:future}
   
  );
});

//RD calculator

app.get("/rd", (req, res) => {
  res.render(__dirname + "/template/rd_calculator.html", {P:"",Year:"",rate_of_intrest:"",total_amount:"", p: "" });
});

// RD Calculator Calculation

// formula for calculate RD M =R[(1+i)n – 1]/1-(1+i)^(-1/3)

app.post("/rd", (req, res) => {
  const P = parseInt(req.body.total_invesment);
  const Year = parseInt(req.body.year);
  const month = Year * 12;
  const rate_of_intrest = parseInt(req.body.return_rate) / 100;
  console.log(rate_of_intrest);
  const total_amount=P*month;

  let p = 0;
  for (let i = 1; i <= month; i++) {
    const Nt = (4 * i * Year) / month;

    const rate = 1 + rate_of_intrest / 4;
    const t = math.pow(rate, Nt);
    const t1 = P * t;
    p = parseInt(p + t1);
  }

  // console.log(p, "totot");

  res.render(__dirname + "/template/rd_calculator.html", {P:"",Year:"",rate_of_intrest:rate_of_intrest,total_amount:total_amount, p: p });
});

//

// nps calculator
app.get("/nps", (req, res) => {
  res.render(__dirname + "/template/nps_calculator.html",{P:"",rate_of_intrest:"",Year:"",principle:"",intrest:"",future:""});
});

// calculation of nps calculator
// Formula A=p(1+r/n)^nt
app.post("/nps", (req, res) => {
  const P = parseInt(req.body.total_invesment);
  const Year = parseInt(req.body.year);
  const rate_of_intrest = parseInt(req.body.return_rate) / 100;
  const total_year = 60 - Year;
  // console.log(total_year);
  const month = total_year * 12;
  const amount = P * 12;
  const principle = P * month;
  // console.log(principle, "principlde");

  // console.log(total_year, "-------------");
  // console.log(total_year, "-------------");
  let amount1 = 0;
  let intrest = 0;
  for (i = 0; i <= month; i++) {
    let i = amount * rate_of_intrest;
    amount1 = amount + i;
    intrest = intrest + amount;
  }
  // console.log(i, "iiiiiiiiiiii");
  console.log(amount1, "iamount");

  const future = intrest + principle;
  // console.log(future, "ffffuttrutu");

  // console.log(intrest, "intrest------------------------");
  res.render(__dirname + "/template/nps_calculator.html",{P:P,rate_of_intrest:rate_of_intrest,Year:Year,principle:principle,intrest:intrest,future:future});
});

// app.listen(2000);
server.listen(2000, () => console.log(`App is running on 2000!`));
