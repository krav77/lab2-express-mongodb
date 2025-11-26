import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [measurements, setMeasurements] = useState([]);
  const [station, setStation] = useState("");
  const [city, setCity] = useState("");
  const [pm25, setPm25] = useState("");
  const [pm10, setPm10] = useState("");
  const [time, setTime] = useState(""); // поле для часу
  const [loading, setLoading] = useState(true);

  const fetchMeasurements = () => {
    fetch("/measurements")
      .then((res) => res.json())
      .then((data) => {
        setMeasurements(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const addMeasurement = async (e) => {
    e.preventDefault();

    const newMeasurement = {
      station_name: station,
      city_name: city,
      pm25: Number(pm25),
      pm10: Number(pm10),
      measurement_time: time ? new Date(time).toISOString() : new Date().toISOString()
    };

    await fetch("/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeasurement)
    });

    setStation("");
    setCity("");
    setPm25("");
    setPm10("");
    setTime("");
    fetchMeasurements();
  };

  const deleteMeasurement = async (id) => {
    await fetch(`/measurements/${id}`, { method: "DELETE" });
    fetchMeasurements();
  };

  if (loading) return <h2>Завантаження даних...</h2>;

  return (
    <div className="container">
      <h1>Показники якості повітря</h1>

      <form onSubmit={addMeasurement} className="form">
        <input
          type="text"
          placeholder="Станція"
          value={station}
          onChange={(e) => setStation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="PM2.5"
          value={pm25}
          onChange={(e) => setPm25(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="PM10"
          value={pm10}
          onChange={(e) => setPm10(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button type="submit">Додати</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Станція</th>
            <th>Місто</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>Час вимірювання</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((item) => (
            <tr key={item._id}>
              <td>{item.station_name}</td>
              <td>{item.city_name}</td>
              <td>{item.pm25}</td>
              <td>{item.pm10}</td>
              <td>{new Date(item.measurement_time).toLocaleString()}</td>
              <td>
                <button onClick={() => deleteMeasurement(item._id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
