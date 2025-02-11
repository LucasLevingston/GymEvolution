import { Toaster } from 'sonner';

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function Container({
	children,
	className,
}: ContainerProps): JSX.Element {
	return (
		<div>
			<div className={`h-full w-full px-20 py-5 ${className}`}>
				{children}
				<Toaster richColors position="top-right" />
			</div>
		</div>
	);
}
