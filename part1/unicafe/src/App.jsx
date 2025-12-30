import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  const { label, value, unit } = props
  const rounded = Number(value.toFixed(2))
  if (unit == null){
    return (
      <tr>
        <td>{label}</td>
        <td>{rounded}</td>
      </tr>
    )
}
  return (
    <tr>
      <td>{label}</td>
      <td>{rounded} {unit}</td>
    </tr>
  )
}

const Stats = (props) => {
  const { good, neutral, bad, total } = props

  if (total < 1) {
    return(
      <div>
        <h1>Statistics</h1>
        No feedback given
      </div>
    )
  }
  const average = (good - bad) / total
  const positive = 100 * (good / total)
  
  return (
    <div>
      <h3>Statistics</h3>
      <table>
        <tbody>
          <StatisticLine label="Good" value={good} />
          <StatisticLine label="Neutral" value={neutral} />
          <StatisticLine label="Bad" value={bad} />
          <StatisticLine label="All" value={total} />
          <StatisticLine label="Average" value={average} />
          <StatisticLine label="Positive" value={positive} unit="%" />
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    console.log('new good', updatedGood)
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    console.log('new bad', updatedBad)
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }
  return (
    <div>
      <h3>Give Feedback</h3>
      <Button onClick={handleGoodClick} text="Good" />
      <Button onClick={handleNeutralClick} text="Neutral" />
      <Button onClick={handleBadClick} text="Bad" />

      <Stats {...{ good, neutral, bad, total }} />
    </div>
  )
}

export default App