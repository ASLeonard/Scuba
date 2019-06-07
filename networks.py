import pandas as pd
from itertools import combinations
from datetime import datetime, timedelta
import json
from matplotlib import cm
import numpy as np
import sys

def rgb2hex(r,g,b):
    
    return "#{:02x}{:02x}{:02x}".format(r,g,b)

def main(days=7):
    data = pd.read_csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vQbCNthNcZ24SW9kOuMpmLr6ubJ_38gFmk42q-24mAPP1VPZtY7C_uqkwwwIhAsQ0r3kS6XrBY45AGs/pub?gid=1075195205&single=true&output=csv')

    nodes = list(data['dive'])
    unique_places = list(set(data['country']))
    bone = cm.get_cmap('viridis', len(unique_places))
    colours={up: bone(i) for (up,i) in zip(unique_places,np.linspace(0,1,len(unique_places)))}
    
    node_dict = [{'id':i, 'group':1, 'site':data.iloc[i-1]['site'],'colour':rgb2hex(*(int(q*255) for q in colours[data.iloc[i-1]['country']][:3]))} for i in nodes]
    edges = []

    thresh = timedelta(days=days)

    for (dive1, dive2) in combinations(nodes,2):
        try:
            date1 = datetime(*(int(i) for i in data.iloc[dive1-1]['date'].split('-')))
            date2 = datetime(*(int(i) for i in data.iloc[dive2-1]['date'].split('-')))
        except:
            continue
        if abs(dive1-dive2)!=0 and date2 - date1 > thresh:
            continue
        
        if dive1 ==178 or dive2 ==178:
            print(dive1,dive2)
        edges.append({'source': dive1, 'target': dive2, 'value': thresh.days-(date2-date1).days})
    print(len(edges))
    full = {'nodes':node_dict, 'links': edges}
    #return full
    with open('network.json','w') as f:
        json.dump(full,f)

if __name__ == '__main__':
    main(int(sys.argv[1]))
        
        
