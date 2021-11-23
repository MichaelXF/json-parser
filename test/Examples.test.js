const JSONParse = require("../src/JSONParse");

test("Variant 1: Article placeholder Example JSON", () => {
  var inputString = `
  {
    "data": [{
      "type": "articles",
      "id": "1",
      "attributes": {
        "title": "JSON:API paints my bikeshed!",
        "body": "The shortest article. Ever.",
        "created": "2015-05-22T14:56:29.000Z",
        "updated": "2015-05-22T14:56:28.000Z"
      },
      "relationships": {
        "author": {
          "data": {"id": "42", "type": "people"}
        }
      }
    }],
    "included": [
      {
        "type": "people",
        "id": "42",
        "attributes": {
          "name": "John",
          "age": 80,
          "gender": "male"
        }
      }
    ]
  }`;

  var output = JSONParse(inputString);
  expect(output).toStrictEqual({
    data: [
      {
        type: "articles",
        id: "1",
        attributes: {
          title: "JSON:API paints my bikeshed!",
          body: "The shortest article. Ever.",
          created: "2015-05-22T14:56:29.000Z",
          updated: "2015-05-22T14:56:28.000Z",
        },
        relationships: {
          author: {
            data: { id: "42", type: "people" },
          },
        },
      },
    ],
    included: [
      {
        type: "people",
        id: "42",
        attributes: {
          name: "John",
          age: 80,
          gender: "male",
        },
      },
    ],
  });
});

test("Variant 2: IPInfo domain Example JSON", () => {
  var inputString = `
  {
    "domain": "comcast.net",
    "num_ranges": "37330",
    "ranges": [
      "23.24.240.0/29",
      "23.24.240.64/29",
      "23.24.240.128/28",
      "23.24.240.152/29",
      "23.24.240.168/29",
      "23.24.240.192/29",
      "23.24.240.208/29",
      "23.24.241.40/29",
      "23.24.241.72/29",
      "23.24.241.96/29",
      "23.24.241.112/28",
      "23.24.241.136/29",
      "23.24.241.168/29",
      "23.24.241.184/29"
     ]
  }
  `;

  var output = JSONParse(inputString);
  expect(output).toStrictEqual({
    domain: "comcast.net",
    num_ranges: "37330",
    ranges: [
      "23.24.240.0/29",
      "23.24.240.64/29",
      "23.24.240.128/28",
      "23.24.240.152/29",
      "23.24.240.168/29",
      "23.24.240.192/29",
      "23.24.240.208/29",
      "23.24.241.40/29",
      "23.24.241.72/29",
      "23.24.241.96/29",
      "23.24.241.112/28",
      "23.24.241.136/29",
      "23.24.241.168/29",
      "23.24.241.184/29",
    ],
  });
});

// https://stackoverflow.com/questions/10539797/complex-json-nesting-of-objects-and-arrays
test("Variant 3: StackOverflow JSON Example", () => {
  var inputString = `
  {
    "medications":[{
            "aceInhibitors":[{
                "name":"lisinopril",
                "strength":"10 mg Tab",
                "dose":"1 tab",
                "route":"PO",
                "sig":"daily",
                "pillCount":"#90",
                "refills":"Refill 3"
            }],
            "antianginal":[{
                "name":"nitroglycerin",
                "strength":"0.4 mg Sublingual Tab",
                "dose":"1 tab",
                "route":"SL",
                "sig":"q15min PRN",
                "pillCount":"#30",
                "refills":"Refill 1"
            }],
            "anticoagulants":[{
                "name":"warfarin sodium",
                "strength":"3 mg Tab",
                "dose":"1 tab",
                "route":"PO",
                "sig":"daily",
                "pillCount":"#90",
                "refills":"Refill 3"
            }],
            "betaBlocker":[{
                "name":"metoprolol tartrate",
                "strength":"25 mg Tab",
                "dose":"1 tab",
                "route":"PO",
                "sig":"daily",
                "pillCount":"#90",
                "refills":"Refill 3"
            }],
            "diuretic":[{
                "name":"furosemide",
                "strength":"40 mg Tab",
                "dose":"1 tab",
                "route":"PO",
                "sig":"daily",
                "pillCount":"#90",
                "refills":"Refill 3"
            }],
            "mineral":[{
                "name":"potassium chloride ER",
                "strength":"10 mEq Tab",
                "dose":"1 tab",
                "route":"PO",
                "sig":"daily",
                "pillCount":"#90",
                "refills":"Refill 3"
            }]
        }
    ],
    "labs":[{
        "name":"Arterial Blood Gas",
        "time":"Today",
        "location":"Main Hospital Lab"      
        },
        {
        "name":"BMP",
        "time":"Today",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"BNP",
        "time":"3 Weeks",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"BUN",
        "time":"1 Year",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"Cardiac Enzymes",
        "time":"Today",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"CBC",
        "time":"1 Year",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"Creatinine",
        "time":"1 Year",
        "location":"Main Hospital Lab"  
        },
        {
        "name":"Electrolyte Panel",
        "time":"1 Year",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"Glucose",
        "time":"1 Year",
        "location":"Main Hospital Lab"  
        },
        {
        "name":"PT/INR",
        "time":"3 Weeks",
        "location":"Primary Care Clinic"    
        },
        {
        "name":"PTT",
        "time":"3 Weeks",
        "location":"Coumadin Clinic"    
        },
        {
        "name":"TSH",
        "time":"1 Year",
        "location":"Primary Care Clinic"    
        }
    ],
    "imaging":[{
        "name":"Chest X-Ray",
        "time":"Today",
        "location":"Main Hospital Radiology"    
        },
        {
        "name":"Chest X-Ray",
        "time":"Today",
        "location":"Main Hospital Radiology"    
        },
        {
        "name":"Chest X-Ray",
        "time":"Today",
        "location":"Main Hospital Radiology"    
        }
    ]
}
  `;

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({
    medications: [
      {
        aceInhibitors: [
          {
            name: "lisinopril",
            strength: "10 mg Tab",
            dose: "1 tab",
            route: "PO",
            sig: "daily",
            pillCount: "#90",
            refills: "Refill 3",
          },
        ],
        antianginal: [
          {
            name: "nitroglycerin",
            strength: "0.4 mg Sublingual Tab",
            dose: "1 tab",
            route: "SL",
            sig: "q15min PRN",
            pillCount: "#30",
            refills: "Refill 1",
          },
        ],
        anticoagulants: [
          {
            name: "warfarin sodium",
            strength: "3 mg Tab",
            dose: "1 tab",
            route: "PO",
            sig: "daily",
            pillCount: "#90",
            refills: "Refill 3",
          },
        ],
        betaBlocker: [
          {
            name: "metoprolol tartrate",
            strength: "25 mg Tab",
            dose: "1 tab",
            route: "PO",
            sig: "daily",
            pillCount: "#90",
            refills: "Refill 3",
          },
        ],
        diuretic: [
          {
            name: "furosemide",
            strength: "40 mg Tab",
            dose: "1 tab",
            route: "PO",
            sig: "daily",
            pillCount: "#90",
            refills: "Refill 3",
          },
        ],
        mineral: [
          {
            name: "potassium chloride ER",
            strength: "10 mEq Tab",
            dose: "1 tab",
            route: "PO",
            sig: "daily",
            pillCount: "#90",
            refills: "Refill 3",
          },
        ],
      },
    ],
    labs: [
      {
        name: "Arterial Blood Gas",
        time: "Today",
        location: "Main Hospital Lab",
      },
      {
        name: "BMP",
        time: "Today",
        location: "Primary Care Clinic",
      },
      {
        name: "BNP",
        time: "3 Weeks",
        location: "Primary Care Clinic",
      },
      {
        name: "BUN",
        time: "1 Year",
        location: "Primary Care Clinic",
      },
      {
        name: "Cardiac Enzymes",
        time: "Today",
        location: "Primary Care Clinic",
      },
      {
        name: "CBC",
        time: "1 Year",
        location: "Primary Care Clinic",
      },
      {
        name: "Creatinine",
        time: "1 Year",
        location: "Main Hospital Lab",
      },
      {
        name: "Electrolyte Panel",
        time: "1 Year",
        location: "Primary Care Clinic",
      },
      {
        name: "Glucose",
        time: "1 Year",
        location: "Main Hospital Lab",
      },
      {
        name: "PT/INR",
        time: "3 Weeks",
        location: "Primary Care Clinic",
      },
      {
        name: "PTT",
        time: "3 Weeks",
        location: "Coumadin Clinic",
      },
      {
        name: "TSH",
        time: "1 Year",
        location: "Primary Care Clinic",
      },
    ],
    imaging: [
      {
        name: "Chest X-Ray",
        time: "Today",
        location: "Main Hospital Radiology",
      },
      {
        name: "Chest X-Ray",
        time: "Today",
        location: "Main Hospital Radiology",
      },
      {
        name: "Chest X-Ray",
        time: "Today",
        location: "Main Hospital Radiology",
      },
    ],
  });
});

// https://documentation.alphasoftware.com/pages/HowTo/List%20Control/Consume%20Complex%20JSON%20Data.xml
test("Variant 4: People Array Example JSON", () => {
  var inputString = `
  [
    {"Firstname": "John", "Lastname" : "Smith", "City" : "Boston", "State" : "MA", "Children": [
            {"Name" : "Callie", "Age" : 5},
            {"Name" : "Griffin", "Age" :3},
            {"Name" : "Luke", "Age" : 1}
        ]
    }, 
    {"Firstname": "Henry", "Lastname" : "Rhodes", "City" : "New York", "State" : "NY", "Children": [
            {"Name" : "Howard", "Age" : 15},
            {"Name" : "Robert", "Age" : 11}
        ]
    }, 
    {"Firstname": "Allison", "Lastname" : "Berman", "City" : "Los Angeles", "State" : "CA", "Children": [
            {"Name" : "Jeff", "Age" : 35},
            {"Name" : "Roxanne", "Age" :33},
            {"Name" : "Claudia", "Age" : 31},
            {"Name" : "Denzel", "Age" : 11}
        ]
    }
]
  `;

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    {
      Firstname: "John",
      Lastname: "Smith",
      City: "Boston",
      State: "MA",
      Children: [
        { Name: "Callie", Age: 5 },
        { Name: "Griffin", Age: 3 },
        { Name: "Luke", Age: 1 },
      ],
    },
    {
      Firstname: "Henry",
      Lastname: "Rhodes",
      City: "New York",
      State: "NY",
      Children: [
        { Name: "Howard", Age: 15 },
        { Name: "Robert", Age: 11 },
      ],
    },
    {
      Firstname: "Allison",
      Lastname: "Berman",
      City: "Los Angeles",
      State: "CA",
      Children: [
        { Name: "Jeff", Age: 35 },
        { Name: "Roxanne", Age: 33 },
        { Name: "Claudia", Age: 31 },
        { Name: "Denzel", Age: 11 },
      ],
    },
  ]);
});
