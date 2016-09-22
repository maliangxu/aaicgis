import sqlite3
import os
con = sqlite3.connect('town.db')
res = con.execute('select enName from townInfo')
for line in res:
    for f in line:
        tc = f.split('_')
        fPath = tc[0]+'/'+tc[1]
        try:
            os.stat(fPath)
        except:
            os.makedirs(fPath)
print '-'*60
