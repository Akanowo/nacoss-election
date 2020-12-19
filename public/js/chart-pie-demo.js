// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example

function generateRandomColor() {
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  const color = '#' + randomColor;
  return color;
}

(async function fetchCandidates(){
  const response = await $.ajax({
    url: '/admin/get-candidates',
    method: 'GET'
  });
  console.log(response);
  const labels = [];
  const data = [];
  const backgroundColor = [];

  const positions = response.positions;

  for(let i = 0; i < positions.length; i++) {
    for(let candidate of response.posts[positions[i].name].candidates) {
      labels.push({
        positionId: positions[i]._id,
        candidateName: candidate.name
      });
      data.push({
        positionId: positions[i]._id,
        candidateVotes: candidate.votes
      });
    }
    for(let label of labels) {
      const color = generateRandomColor();
      backgroundColor.push({
        positionId: positions[i]._id,
        candidateColor: color
      });
    }
    const ctx = document.getElementById(positions[i]._id);
    const positionLabels = labels.filter((x) => x.positionId === positions[i]._id);
    const positionData = data.filter((x) => x.positionId === positions[i]._id);
    const positionColors = backgroundColor.filter((x) => x.positionId === positions[i]._id);

    const candidatesNames = [];
    const candidatesData = [];
    const candidatesColors = [];

    for(let label of positionLabels) {
      candidatesNames.push(label.candidateName);
    }
    for(let data of positionData) {
      candidatesData.push(data.candidateVotes);
    }
    for(let color of positionColors) {
      candidatesColors.push(color.candidateColor);
    }
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: candidatesNames,
          datasets: [{
            data: candidatesData,
            backgroundColor: candidatesColors
          }],
        },
      });
  }

  
}());
