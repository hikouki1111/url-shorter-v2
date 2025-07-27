"use client"
import {useState} from "react"

type ResultProps = {
  error: boolean
  message: string
}

const Result = ({ error, message }: ResultProps) => {
  const getColor = () => {
    return error
      ? "border-red-500 bg-red-100"
      : "border-blue-500 bg-blue-100"
  }

  return (
    <div className={`text-black text-center border rounded-sm w-64 bg-opacity-50 ${getColor()}`}>
      <p>{message}</p>
    </div>
  )
}

export default function Home() {
  const [result, setResult] = useState<ResultProps | null>(null)
  const [url, setURL] = useState<string>("")

  const changeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  }

  const submitShorten = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()

    const formData = new FormData()
    formData.set("url", url)

    fetch("/api/shorter", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
        const json = await res.json()
        setResult({ error: json.error, message: json.message })
      }
    ).catch(() => {
      setResult({ error: true, message: "failed to fetch" })
    })
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header>
        <h1 className="text-5xl">URL Shorter v2</h1>
      </header>
      <main id="main-container" className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form onSubmit={submitShorten} className="flex flex-col gap-[12px] items-center">
          {result && <Result error={result.error} message={result.message} />}
          <p>URL to be shorten</p>
          <input onChange={changeURL} className="input-button" name="url" type="url" required />
          <button className="input-button" type="submit">Shorten</button>
        </form>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  )
}
