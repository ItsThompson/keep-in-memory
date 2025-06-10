import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
    return (
        <main className="m-2 p-6 max-w-3xl mx-auto text-white bg-secondary rounded-lg">
            <Link className="hover:cursor-pointer" href="/">
                <h1 className="text-2xl font-bold mb-6 text-primary flex items-center space-x-4">
                    <Image
                        src="/brain.svg"
                        alt="kim logo"
                        width={36}
                        height={36}
                    />
                    <span>kim: keep in memory</span>
                </h1>
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-primary">
                Privacy Policy
            </h1>

            <p className="mb-4">
                Thanks for trusting kim (&apos;kim&apos;, &apos;we&apos;, &apos;us&apos;, &apos;our&apos;) with your
                personal information! We take our responsibility to you very
                seriously, and so this Privacy Statement describes how we handle
                your data.
            </p>

            <p className="mb-4">
                This Privacy Statement applies to all websites we own and
                operate and to all services we provide (collectively, the
                &apos;Services&apos;). By using the Services, you are expressly and
                voluntarily accepting the terms and conditions of this Privacy
                Statement and our Terms of Service, which include allowing us to
                process information about you.
            </p>

            <p className="mb-4">
                Under this Privacy Statement, we are the data controller
                responsible for processing your personal information. Our
                contact information appears at the end of this Privacy
                Statement.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                What data do we collect?
            </h2>
            <p className="mb-2">kim collects the following data:</p>
            <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Email</li>
                <li>Username</li>
                <li>Google Profile Picture</li>
                <li>Information about game progress</li>
                <li>Information about game results</li>
                <li>Your currently active settings</li>
            </ul>
            <p className="mb-4">
                If you believe a certain data type is missing from the lists
                above, feel free to contact us and we will answer any questions
                and update the privacy policy.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                How do we collect your data?
            </h2>
            <p className="mb-2">
                You directly provide most of the data we collect. We collect
                data and process data when you:
            </p>
            <ul className="list-disc list-inside mb-8 space-y-1">
                <li>Create an account</li>
                <li>Enter recalled items during gameplay</li>
                <li>Change settings on the website</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                How will we use your data?
            </h2>
            <p className="mb-2">
                kim collects your data so that we can provide the Services to
                you, including:
            </p>
            <ul className="list-disc list-inside mb-8 space-y-1">
                <li>Allowing you to create an account</li>
                <li>Allowing you to complete the game</li>
                <li>Allowing you to change settings on the website</li>
                <li>Allowing you to view your game progress and results</li>
                <li>
                    Allow you to view result history of previous tests you
                    completed
                </li>
                <li>
                    Save results from tests you take and show you statistics
                    based on them
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                How do we store your data?
            </h2>
            <p className="mb-4">
                kim securely stores your data using DynamoDB.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Changes to our privacy policy
            </h2>
            <p className="mb-4">
                kim keeps its privacy policy under regular review and places any
                updates on this web page. The kim privacy policy may be subject
                to change at any given time without notice.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                How to contact us
            </h2>
            <p className="mb-2">
                If you have any questions about kim’s privacy policy, the data
                we hold on you, or you would like to exercise one of your data
                protection rights, please do not hesitate to contact us.
            </p>
            <p className="underline">itsthompson1@gmail.com</p>
        </main>
    );
}
