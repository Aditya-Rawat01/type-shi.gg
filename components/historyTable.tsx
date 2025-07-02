import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { results } from "./profilePage"
import { memo, useEffect, useState } from "react"
import axios from "axios"
import { URI } from "@/lib/URI"
import { toast } from "sonner"
import { Button } from "./ui/button"
import "./components.css"
const TableData = [
  {
    rawWpm:20,
    avgWpm:20,
    accuracy:40,
    charSets:"2/2/2/2",
    mode: "time 15",
    details: "",
    date:"20/01/25"
  }
]

const HistoryTable= memo(()=>{
      const [cursorId, setCursorId] = useState<string|null>(null)
      const [results, setResults] = useState<results>([])
      const [isFetching, setIsFetching] = useState(true)
      const [refresh, setRefresh] = useState(1) // random value to hold as if changing this value in useEffect will cause another useEffect to run 2 times
  useEffect(()=>{
        async function LoadResults() {
          try {
            const query = cursorId ? `?cursorId=${cursorId}` : '';
            const res:{data:{data:results}} = await axios.get(`${URI}/api/getResults${query}`,{
              params:{
                cursorId: cursorId
              }
            })
            const resultsVal = res.data.data
            console.log({resultsVal})
            setTimeout(()=>{
            setResults((prev)=>([...prev, ...resultsVal]))
            setCursorId(resultsVal.length>0?resultsVal[resultsVal.length-1].id:null)
          },500)
          } catch (error) {
            toast.error(error as string)
          }
        }
        
          setTimeout(()=>{
            setIsFetching(false)
          },500)
        LoadResults()
      },[refresh])
  async function handleRefresh() {
    if (isFetching) return // redundant.
    console.log(cursorId)
        setIsFetching(true)
    setRefresh(Date.now())
  }
  return (
    <Table className="w-full sm:w-4/5 bg-amber-300">
      <TableCaption>A list of your recent TableData.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-center">Raw Wpm</TableHead>
          <TableHead className="w-[100px] text-center">Avg Wpm</TableHead>
          <TableHead className="w-[100px] text-center">Accuracy</TableHead>
          <TableHead className="w-[100px] text-center">CharSets</TableHead>
          <TableHead className="w-[100px] text-center">Mode</TableHead>
          <TableHead className="w-[100px] text-center">Details</TableHead>
          <TableHead className="w-[100px] text-center">Date</TableHead>


        </TableRow>
      </TableHeader>
      <TableBody>
        {results.length >0 ? 
        results.map((test, index) => (
          <TableRow key={index}>
            <TableCell>{test.rawWpm}</TableCell>
            <TableCell>{test.avgWpm}</TableCell>
            <TableCell>{test.accuracy+"%"}</TableCell>
            <TableCell>{test.charSets}</TableCell>
            <TableCell className="">{test.mode}</TableCell>
            {/* <TableCell className="">{test.details}</TableCell> */}
            <TableCell className="">{
            <>
            <p>{new Date(test.createdAt).toLocaleTimeString()}</p>
            <p>{new Date(test.createdAt).toDateString()}</p>
            </> 

            }</TableCell>


          </TableRow>
        ))
        :
        <TableRow>
          <TableCell colSpan={8}>
            
          No results to show
          </TableCell>
          
          </TableRow>
      }
      </TableBody>
      <TableFooter>
        <TableRow>
          { (results.length>5 && cursorId) && <TableCell colSpan={8}>
            <Button className={`h-[36px] w-[107.14px] cursor-pointer`} disabled={isFetching} onClick={handleRefresh}>
              { !isFetching?<span>Load More</span>:<span className="loader2"></span>}
              </Button>
            </TableCell>}
        </TableRow>
      </TableFooter>
    </Table>
  )
})

export default HistoryTable