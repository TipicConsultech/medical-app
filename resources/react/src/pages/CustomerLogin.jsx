import { useState } from "react";
import { post } from "../util/api";
import gibliImage from "../assets/gibli.png";

export default function CustomerLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await post("/api/customerLogin", {
        mobile,
        password,
      });

      // If login successful
      console.log(response.data);
      alert("Login successful!");
      // Redirect or store token if needed
    } catch (err) {
      setError("Invalid mobile number or password.");
    }
  };

  return (
    <div className="h-full flex mt-40 justify-center ">
      <div className="flex w-full max-w-lvh align-middle bg-white p-6 justify-around rounded-lg shadow-md border border-gray-200">
       <div className="mr-3 md:mr-0">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-2">
         Login
        </h2 >
        <form onSubmit={handleLogin} className="space-y-2">
      
          <div >
            {/* <label className="text-sm text-gray-700">Mobile Number</label> */}
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            {/* <label className="text-sm text-gray-700">Password</label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        </div>
        <img  src = {gibliImage} className="rounded-lg max-h-60  align-middle justify-center"></img>
      </div>
    </div>
  );
}
