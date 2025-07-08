
// Quick test to verify token workflow
const test = async () => {
  const tokenRes = await fetch("http://localhost:5000/api/generate-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "growth", ghlContactId: "test_quick_123" })
  });
  const tokenData = await tokenRes.json();
  console.log("Token generated:", tokenData.token.substring(0, 20) + "...");
  
  const validRes = await fetch("http://localhost:5000/api/validate-token", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: tokenData.token })
  });
  const validData = await validRes.json();
  console.log("Token valid:", validData.valid);
  console.log("Type:", validData.type);
  console.log("GHL Contact ID:", validData.ghlContactId);
};
test();

