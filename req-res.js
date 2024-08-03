// const fetchData = async () => {
//   const url = "http://localhost:7000/api/v1/products";
//   try {
//     const res = await fetch(url);
//     if (!res.ok) {
//       throw new Error("Network response was not ok.");
//     }
//     const data = await res.json();
//     console.log("Data Recieved:", data);
//   } catch (error) {
//     console.error("Error fetching data", error);
//   }
// };
// fetchData();

// // //  dekh le ese krna h fetch

const apiUrl = "http://localhost:7000/api/v1/auth/login";

fetch(apiUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    identifier: "9109390639",
    password: "secret",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("POST response:", JSON.stringify(data, null, 2)))
  .catch((error) => console.error("Error:", error));

// useEffect(() => {
//   fetch("http://localhost:3000/api/products")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       // Handle your data here
//     })
//     .catch((error) => {
//       console.error("Fetch error:", error);
//     });
// }, []);
