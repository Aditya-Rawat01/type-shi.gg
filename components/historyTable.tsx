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

export default function HistoryTable({results}:{results:results}) {
  console.log({length:results})
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
            <TableCell className="font-medium">{test.rawWpm}</TableCell>
            <TableCell className="font-medium">{test.avgWpm}</TableCell>
            <TableCell>{test.accuracy}</TableCell>
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
          {results.length>0 && <TableCell colSpan={8}>Load More</TableCell>}
        </TableRow>
      </TableFooter>
    </Table>
  )
}
