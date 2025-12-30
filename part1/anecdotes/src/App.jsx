import { useState } from 'react'

const getRandInt = (max) => {
  return Math.floor(Math.random() * max)
}

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const clickAnecdote = (props) => {
  const { selected, setSelected, range} = props
  const newVal = getRandInt(range)
  setSelected(newVal)
  console.log('new value', newVal)
}

const clickVote = (props) => {
  const { votes, setVotes, selected } = props
  const copy = [...votes]
  copy[selected] += 1
  setVotes(copy)
} 

// getHighestIndex removed — compute mostVoted directly from `votes` inside App


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const options = anecdotes.length
  const [votes, setVotes] = useState(Array(options).fill(0))
  const mostVoted = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]} <br/>
      Has {votes[selected]} votes <br/>
      <Button onClick={()=>clickVote({votes, setVotes, selected})} text="Vote"/>
      <Button onClick={() => clickAnecdote({selected, setSelected, range: options})} text="Next Anecdote"/>
      <h2>Anecdote with most votes</h2>
      {anecdotes[mostVoted]}<br />
      Has {votes[mostVoted]} votes
    </div>
  )
}

export default App