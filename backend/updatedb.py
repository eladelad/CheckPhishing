from urlparse import urlparse
import urllib2
import urllib
import json
import sys
import os.path

current_dir = os.path.dirname(os.path.realpath(__file__))

openphish_file = os.path.join(current_dir, '../', 'localdb', 'openphish.txt')
phishtank_file = os.path.join(current_dir, '../', 'localdb', 'phishtank.txt')

print openphish_file

try:
    phishtank = open(phishtank_file, "w")
except (OSError, IOError) as e:
    print "Error opening file"

urllib.urlretrieve('https://openphish.com/feed.txt', openphish_file)


response = urllib2.urlopen('http://data.phishtank.com/data/online-valid.json')
json = json.loads(response.read())

for url in json:
    phishtank.write("%s\n" % url['url'].encode("utf-8"))

phishtank.close()