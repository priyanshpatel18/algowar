import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'

interface IProps {
  userOneImage: string;
  userOneName: string;
  userOneRating: number;
  userTwoImage: string;
  userTwoName: string;
  userTwoRating: number;
  gameStage: number;
}

const rounds = {
  gameStage: 1,
  gameDesc: "Evaluating code structure"
}

export default function GameCard() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-lg font-bold'>User 1</h3>
            <p className="text-sm text-muted-foreground">1500 rating</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-lg font-bold'>User 2</h3>
            <p className="text-sm text-muted-foreground">1480 rating</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center'>
          <div>
            <h4 className="text-lg font-bold">Round 1</h4>
            <p className="text-sm text-muted-foreground">Evaluating code structure</p>
          </div>
          <Button variant="secondary">View Match</Button>
        </div>
      </CardContent>
    </Card>
  )
}
