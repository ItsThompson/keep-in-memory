import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
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
                Terms of Service
            </h1>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Agreement
            </h2>

            <p className="mb-4">
                By accessing this Website, accessible from
                keep-in-memory.vercel.app, you are agreeing to be bound by these
                Website Terms of Service and agree that you are responsible for
                the agreement in accordance with any applicable local laws. IF
                YOU DO NOT AGREE TO ALL THE TERMS AND CONDITIONS OF THIS
                AGREEMENT, YOU ARE NOT PERMITTED TO ACCESS OR USE OUR SERVICES.
            </p>
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Limitations
            </h2>
            <p className="mb-4">
                You are responsible for your account's security and all
                activities on your account. You must not, in the use of this
                site, violate any applicable laws, including, without
                limitation, copyright laws, or any other laws regarding the
                security of your personal data, or otherwise misuse this site.
            </p>
            <p className="mb-4">
                kim reserves the right to remove or disable any account or any
                other content on this site at any time for any reason, without
                prior notice to you, if we believe that you have violated this
                agreement.
            </p>
            <p className="mb-2">
                You agree that you will not upload, post, host, or transmit any
                content that:
            </p>
            <ol className="list-disc list-inside mb-6 space-y-1">
                <li>is unlawful or promotes unlawful activities;</li>
                <li>is or contains sexually obscene content;</li>
                <li>is libelous, defamatory, or fraudulent;</li>
                <li>
                    is discriminatory or abusive toward any individual or group;
                </li>
                <li>
                    is degrading to others on the basis of gender, race, class,
                    ethnicity, national origin, religion, sexual preference,
                    orientation, or identity, disability, or other
                    classification, or otherwise represents or condones content
                    that: is hate speech, discriminating, threatening, or
                    pornographic; incites violence; or contains nudity or
                    graphic or gratuitous violence;
                </li>
                <li>
                    violates any person's right to privacy or publicity, or
                    otherwise solicits, collects, or publishes data, including
                    personal information and login information, about other
                    Users without consent or for unlawful purposes in violation
                    of any applicable international, federal, state, or local
                    law, statute, ordinance, or regulation; or
                </li>
                <li>
                    contains or installs any active malware or exploits/uses our
                    platform for exploit delivery (such as part of a command or
                    control system); or infringes on any proprietary right of
                    any party, including patent, trademark, trade secret,
                    copyright, right of publicity, or other rights.
                </li>
            </ol>
            <p className="mb-2">
                While using the Services, you agree that you will not:
            </p>
            <ol className="list-disc list-inside mb-6 space-y-1">
                <li>
                    harass, abuse, threaten, or incite violence towards any
                    individual or group, including other Users and kim
                    contributors;
                </li>
                <li>
                    use our servers for any form of excessive automated bulk
                    activity (e.g., spamming), or rely on any other form of
                    unsolicited advertising or solicitation through our servers
                    or Services;
                </li>
                <li>
                    attempt to disrupt or tamper with our servers in ways that
                    could a) harm our Website or Services or b) place undue
                    burden on our servers;
                </li>
                <li>
                    {" "}
                    access the Services in ways that exceed your authorization;
                </li>
                <li>
                    {" "}
                    falsely impersonate any person or entity, including any of
                    our contributors, misrepresent your identity or the site's
                    purpose, or falsely associate yourself with kim;
                </li>
                <li>
                    {" "}
                    violate the privacy of any third party, such as by posting
                    another person's personal information without their consent;{" "}
                </li>
                <li>
                    {" "}
                    access or attempt to access any service on the Services by
                    any means other than as permitted in this Agreement, or
                    operating the Services on any computers or accounts which
                    you do not have permission to operate;
                </li>
                <li>
                    {" "}
                    facilitate or encourage any violations of this Agreement or
                    interfere with the operation, appearance, security, or
                    functionality of the Services; or
                </li>
                <li>
                    use the Services in any manner that is harmful to minors.
                </li>
            </ol>
            <p className="mb-4">
                Without limiting the foregoing, you will not transmit or post
                any content anywhere on the Services that violates any laws. kim
                absolutely does not tolerate engaging in activity that
                significantly harms our Users. We will resolve disputes in favor
                of protecting our Users as a whole.
            </p>
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Privacy Policy
            </h2>
            <p className="mb-4">
                If you use our Services, you must abide by our Privacy Policy.
                You acknowledge that you have read our{" "}
                <Link className="underline text-primary" href="/privacy">
                    Privacy Statement
                </Link>{" "}
                and understand that it sets forth how we collect, use, and store
                your information. If you do not agree with our Privacy
                Statement, then you must stop using the Services immediately.
                Any person, entity, or service collecting data from the Services
                must comply with our Privacy Statement. Misuse of any User's
                Personal Information is prohibited. If you collect any Personal
                Information from a User, you agree that you will only use the
                Personal Information you gather for the purpose for which the
                User has authorized it. You agree that you will reasonably
                secure any Personal Information you have gathered from the
                Services, and you will respond promptly to complaints, removal
                requests, and 'do not contact' requests from us or Users.
            </p>
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Limitations on Automated Use
            </h2>
            <p className="mb-4">
                You shouldn't use bots or access our Services in malicious or
                prohibited ways. While accessing or using the Services, you may
                not:
            </p>
            <ol className="list-disc list-inside mb-6 space-y-1">
                <li>use bots, hacks, or cheats while using our site;</li>
                <li> create manual requests to kim servers;</li>
                <li>
                    {" "}
                    tamper with or use non - public areas of the Services, or
                    the computer or delivery systems of kim and / or its service
                    providers;
                </li>
                <li>
                    probe, scan, or test any system or network (particularly for
                    vulnerabilities), or otherwise attempt to breach or
                    circumvent any security or authentication measures, or
                    search or attempt to access or search the Services by any
                    means (automated or otherwise) other than through our
                    currently available, published interfaces that are provided
                    by kim (and only pursuant to those terms and conditions),
                    unless you have been specifically allowed to do so in a
                    separate agreement with kim, Inc., or unless specifically
                    permitted by kim, Inc.'s robots.txt file or other robot
                    exclusion mechanisms;
                </li>
                <li>
                    {" "}
                    scrape the Services, scrape Content from the Services, or
                    use automated means, including spiders, robots, crawlers,
                    data mining tools, or the like to download data from the
                    Services or otherwise access the Services;
                </li>
                <li>
                    {" "}
                    employ misleading email or IP addresses or forged headers or
                    otherwise manipulated identifiers in order to disguise the
                    origin of any content transmitted to or through the
                    Services;
                </li>
                <li>
                    {" "}
                    use the Services to send altered, deceptive, or false source
                    - identifying information, including, without limitation, by
                    forging TCP - IP packet headers or e - mail headers; or
                </li>
                <li>
                    interfere with, or disrupt or attempt to interfere with or
                    disrupt, the access of any User, host, or network,
                    including, without limitation, by sending a virus to,
                    spamming, or overloading the Services, or by scripted use of
                    the Services in such a manner as to interfere with or create
                    an undue burden on the Services.
                </li>
            </ol>
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Links
            </h2>
            <p className="mb-4">
                Our Services may contain links to third-party websites or
                services that are not owned or controlled by kim. We have no
                control over, and assume no responsibility for, the content,
                privacy policies, or practices of any third-party websites or
                services. You acknowledge and agree that kim shall not be
                responsible or liable, directly or indirectly, for any damage or
                loss caused or alleged to be caused by or in connection with the
                use of any such content, goods, or services available on or
                through any such websites or services.
            </p>
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Changes to the Terms of Service
            </h2>
            <p className="mb-4">
                We may modify these Terms of Service at any time. If we make
                changes, we will notify you by revising the date at the top of
                these Terms of Service. If you continue to use the Services
                after the changes become effective, you agree to be bound by the
                revised Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-primary">
                Disclaimer
            </h2>
            <p className="mb-4">
                The Services are provided on an "as is" and "as available"
                basis. kim makes no warranties or representations about the
                accuracy, reliability, completeness, or timeliness of the
                Services or any content provided through the Services. To the
                fullest extent permitted by applicable law, kim disclaims all
                warranties, express or implied, including, but not limited to,
                implied warranties of merchantability, fitness for a particular
                purpose, and non-infringement. You acknowledge that your use of
                the Services is at your own risk, and you are solely responsible
                for any damage to your computer system or loss of data that
                results from such use.
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
