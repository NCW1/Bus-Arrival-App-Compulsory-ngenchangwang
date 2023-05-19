const busStopIdInput = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalInfo");

async function fetchBusArrival(busStopId) {
	const response = await fetch(`https://sg-bus-arrival.haris-samingan.repl.co/?id=${busStopId}`);

	if (response.ok) {
		const data = await response.json();
		return data;
	}
	else {
		throw new Error("Error fetching bus arrival data.");
	}
}

function formatArrivalData(arrivalData) {
	const buses = arrivalData.services;
	const formattedData = [];

	for (const bus of buses) {
		let arrivalTimeString;

		if (bus.next_bus_mins < 0) {
			arrivalTimeString = "Arriving";
		}
		else {
			arrivalTimeString = `${bus.next_bus_mins} min(s)`;
		}

		formattedData.push(`
      <div>
        <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
      </div>
    `);
	}

	const totalBuses = buses.length;
	const outputString = `
    <div>
      <strong>Total Buses:</strong> ${totalBuses}
    </div>
	<br>
    ${formattedData.join("")}
  `;

	return outputString;
}

function displayBusArrival(busStopId) {
	arrivalInfo.innerHTML = "Loading...";
	fetchBusArrival(busStopId)
		.then((arrivalData) => {
			const formattedArrivalData = formatArrivalData(arrivalData);
			arrivalInfo.innerHTML = formattedArrivalData;
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function startBusDataUpdate(busStopId) {
	displayBusArrival(busStopId);
	setInterval(() => {
		displayBusArrival(busStopId);
	}, 5000);
}

function getBusTiming() {
	const busStopId = busStopIdInput.value;
	startBusDataUpdate(busStopId);
}