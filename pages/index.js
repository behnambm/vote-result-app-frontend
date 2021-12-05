import { useState, useEffect } from "react"
import { io } from "socket.io-client"

export default function Home() {

  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("results", (payload) => {
      const data = JSON.parse(payload)
      setData(prevData => {
        const newData = prevData.map(item => {
          if (item.id == data.vote_id){
            const first_option = data.options[0]
            const second_option = data.options[1]
            item.count_of_first = data[first_option]
            item.count_of_second = data[second_option]
          }
          return item
        })
        return newData
      })
    });
    
    fetch('http://localhost:5000/results')
    .then(resp => {
      if (resp.ok) return resp.json()
      setError(true)
    })
    .then(data => {
      setData(data)
    })
  }, [])

  if (error) return <div>failed to load</div>
  if (data === null) return <div>loading...</div>
  console.log(data)
  return (
    <div className='container '>
    {data?.map(vote => {
      const total_votes = vote.count_of_first + vote.count_of_second
      const first_percent = parseFloat((vote.count_of_first / total_votes) * 100).toFixed(2)
      const second_percent = parseFloat((vote.count_of_second / total_votes) * 100).toFixed(2)
      return (
        <section className='bg-gray-100 p-2 my-2' key={vote.id}>
          <h1 className='capitalize font-bold'>{vote.title}</h1>
          <p className='mb-4'>{vote.description}</p>
          <div className='flex'>
            <div 
            className={`${first_percent === '0.00' ? 'hidden' : 'bg-green-500'} px-2 py-4 flex-grow transition-all duration-500`}
            style={{flexBasis: first_percent + '%'}}>
              {first_percent}%
            </div>
            <div className={`${second_percent === '0.00' ? 'hidden' : 'bg-indigo-500'}  px-2 py-4 flex-grow transition-all	duration-500`} style={{
              flexBasis: second_percent + '%'
            }}>{second_percent}%</div>
          </div>
          </section>
      )
    })}
    </div>
  )
}
