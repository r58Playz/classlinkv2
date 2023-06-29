
export default function SsoDummy(){return <div></div>}

export function getServerSideProps({ resolvedUrl }) {
  return { redirect: { permanent: false, destination: "https://idp.classlink.com"+resolvedUrl } }
}
