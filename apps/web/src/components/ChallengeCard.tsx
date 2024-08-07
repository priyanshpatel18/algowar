import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface IProps {
  title: string;
  subtitle: string;
  challenge: string;
}

export default function ChallengeCard({ title, subtitle, challenge }: IProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <CodeIcon className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Challenge</h3>
            <p className="text-sm text-muted-foreground">{challenge}</p>
          </div>
          <Button variant="secondary">Join</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}