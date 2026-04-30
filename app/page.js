 /button>
            <div className="grid grid-cols-2 gap-2">
              {results.map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i+1}`} className="rounded-lg"/>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

        
