import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function Leaderboard() {
  return (
    <div className="mt-4 rounded-lg border bg-background p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Wins</TableHead>
            <TableHead>Losses</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>User 1</TableCell>
            <TableCell>1800</TableCell>
            <TableCell>225</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>User 2</TableCell>
            <TableCell>1750</TableCell>
            <TableCell>275</TableCell>
            <TableCell>170</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>User 3</TableCell>
            <TableCell>1600</TableCell>
            <TableCell>205</TableCell>
            <TableCell>120</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
